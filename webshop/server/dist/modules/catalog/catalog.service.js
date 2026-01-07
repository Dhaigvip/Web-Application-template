"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const category_service_1 = require("./category.service");
const facet_service_1 = require("./facet.service");
const product_service_1 = require("./product.service");
let CatalogService = class CatalogService {
    constructor(prisma, categories, products, facets) {
        this.prisma = prisma;
        this.categories = categories;
        this.products = products;
        this.facets = facets;
    }
    async getProducts(input) {
        const includeInactive = input.includeInactive ?? false;
        const categoryIds = await this.categories.resolveCategoryScope(input.category, { includeInactive });
        let where = this.products.buildBaseQuery({
            categoryIds,
            search: input.q,
            priceMin: input.priceMin,
            priceMax: input.priceMax,
            includeInactive
        });
        where = this.products.applyAttributeFilters(where, input.attributes);
        const [attributeFacets, priceFacet] = await Promise.all([
            this.facets.computeAttributeFacets(where),
            this.facets.computePriceFacet(where)
        ]);
        const totalItems = await this.prisma.product.count({ where });
        const orderBy = this.products.applySorting(input.sort);
        const rows = await this.prisma.product.findMany({
            where,
            orderBy,
            skip: (input.page - 1) * input.pageSize,
            take: input.pageSize,
            select: {
                id: true,
                slug: true,
                name: true,
                description: true
            }
        });
        return {
            data: rows.map((p) => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                description: p.description
            })),
            pagination: {
                page: input.page,
                pageSize: input.pageSize,
                totalItems,
                totalPages: Math.ceil(totalItems / input.pageSize)
            },
            facets: {
                attributes: attributeFacets,
                price: priceFacet
            }
        };
    }
    async getProductBySlug(slug, opts) {
        const includeInactive = opts?.includeInactive ?? false;
        const product = await this.products.getProductBySlug(slug, { includeInactive });
        const primaryCategory = product.categories.find((c) => c.isPrimary)?.category;
        if (!primaryCategory) {
            throw new common_1.NotFoundException("PRIMARY_CATEGORY_NOT_FOUND");
        }
        // In B2C, if primary category is inactive, hide product (don’t leak).
        if (!includeInactive && !primaryCategory.isActive) {
            throw new common_1.NotFoundException("PRODUCT_NOT_FOUND");
        }
        const [breadcrumbs, attributes] = await Promise.all([
            this.categories.getCategoryPath(primaryCategory.id, { includeInactive }),
            this.products.getProductAttributes(product.id)
        ]);
        return {
            product: {
                id: product.id,
                slug: product.slug,
                name: product.name,
                description: product.description
            },
            breadcrumbs: breadcrumbs.map((b) => ({
                path: b.path,
                slug: b.slug,
                name: b.name
            })),
            attributes
        };
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        category_service_1.CategoryService,
        product_service_1.ProductService,
        facet_service_1.FacetService])
], CatalogService);
