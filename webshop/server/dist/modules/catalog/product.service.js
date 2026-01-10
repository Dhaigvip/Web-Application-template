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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ---------------------------
    // LISTING HELPERS
    // ---------------------------
    buildBaseQuery(filters) {
        const includeInactive = filters.includeInactive ?? false;
        const where = includeInactive
            ? {}
            : {
                isActive: true
            };
        if (filters.categoryIds?.length) {
            where.categories = {
                some: {
                    categoryId: { in: filters.categoryIds }
                }
            };
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } }
            ];
        }
        // Price filtering intentionally not supported (no price field in schema).
        return where;
    }
    applyAttributeFilters(where, attributes) {
        if (!attributes || Object.keys(attributes).length === 0)
            return where;
        const andClauses = Object.entries(attributes)
            .filter(([_, values]) => Array.isArray(values) && values.length > 0)
            .map(([attributeCode, values]) => ({
            attributes: {
                some: {
                    attribute: { code: attributeCode, isFilterable: true },
                    attributeValue: { value: { in: values } }
                }
            }
        }));
        if (andClauses.length === 0)
            return where;
        return {
            ...where,
            AND: [...(where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : []), ...andClauses]
        };
    }
    applySorting(sort) {
        switch (sort) {
            case "name_asc":
                return [{ name: "asc" }];
            case "name_desc":
                return [{ name: "desc" }];
            default:
                return [{ name: "asc" }];
        }
    }
    // ---------------------------
    // PDP HELPERS
    // ---------------------------
    async getProductBySlug(slug, opts) {
        const includeInactive = opts?.includeInactive ?? false;
        const product = await this.prisma.product.findFirst({
            where: includeInactive ? { slug } : { slug, isActive: true },
            select: {
                id: true,
                slug: true,
                name: true,
                description: true,
                imageUrl: opts?.apiVersion === 2 ? true : false,
                categories: {
                    select: {
                        isPrimary: true,
                        category: {
                            select: {
                                id: true,
                                slug: true,
                                name: true,
                                path: true,
                                parentId: true,
                                level: true,
                                sortOrder: true,
                                isActive: true
                            }
                        }
                    }
                }
            }
        });
        if (!product)
            throw new common_1.NotFoundException("PRODUCT_NOT_FOUND");
        return product;
    }
    async getProductAttributes(productId) {
        const rows = await this.prisma.productAttribute.findMany({
            where: {
                productId,
                attributeValueId: { not: null }
            },
            select: {
                attribute: {
                    select: {
                        code: true,
                        name: true,
                        sortOrder: true
                    }
                },
                attributeValue: {
                    select: {
                        value: true,
                        label: true,
                        sortOrder: true
                    }
                }
            },
            orderBy: [{ attribute: { sortOrder: "asc" } }, { attributeValue: { sortOrder: "asc" } }]
        });
        const attributes = {};
        for (const row of rows) {
            if (!row.attributeValue)
                continue;
            const key = row.attribute.code;
            if (!attributes[key]) {
                attributes[key] = { label: row.attribute.name, values: [] };
            }
            attributes[key].values.push({
                value: row.attributeValue.value,
                label: row.attributeValue.label
            });
        }
        return attributes;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
