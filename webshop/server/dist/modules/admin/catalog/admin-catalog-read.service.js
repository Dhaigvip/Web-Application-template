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
exports.AdminCatalogReadService = void 0;
// src/modules/admin/catalog/admin-catalog-read.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let AdminCatalogReadService = class AdminCatalogReadService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProductList(query, opts) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const where = {};
        if (query.q) {
            where.OR = [
                { name: { contains: query.q, mode: "insensitive" } },
                { slug: { contains: query.q, mode: "insensitive" } }
            ];
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        if (query.categoryPath) {
            where.categories = {
                some: {
                    category: { path: query.categoryPath }
                }
            };
        }
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { updatedAt: "desc" },
                include: {
                    categories: {
                        where: { isPrimary: true },
                        include: { category: true }
                    }
                }
            }),
            this.prisma.product.count({ where })
        ]);
        return {
            items: items.map((p) => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                isActive: p.isActive,
                ...(opts?.apiVersion === 2 ? { imageUrl: p.imageUrl } : {}),
                primaryCategoryPath: p.categories[0]?.category.path ?? null,
                updatedAt: p.updatedAt
            })),
            total,
            page,
            pageSize
        };
    }
    async getProductDetail(id, opts) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                categories: {
                    include: { category: true }
                },
                attributes: {
                    include: {
                        attribute: true,
                        attributeValue: true
                    }
                }
            }
        });
        if (!product)
            throw new common_1.NotFoundException();
        return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            isActive: product.isActive,
            ...(opts?.apiVersion === 2 ? { imageUrl: product.imageUrl } : {}),
            categories: product.categories.map((c) => ({
                id: c.category.id,
                path: c.category.path,
                isPrimary: c.isPrimary
            })),
            attributes: product.attributes.map((a) => ({
                code: a.attribute.code,
                type: a.attribute.type,
                value: a.attribute.type === "ENUM"
                    ? a.attributeValue?.value ?? null
                    : a.attribute.type === "NUMBER"
                        ? a.valueNumber
                        : a.attribute.type === "BOOLEAN"
                            ? a.valueBoolean
                            : a.valueText
            }))
        };
    }
    async getAttributes() {
        const attrs = await this.prisma.attribute.findMany({
            orderBy: { sortOrder: "asc" },
            include: { values: true }
        });
        return attrs.map((a) => ({
            code: a.code,
            name: a.name,
            type: a.type,
            isFilterable: a.isFilterable,
            isFacetable: a.isFacetable,
            values: a.values.map((v) => ({
                value: v.value,
                label: v.label
            }))
        }));
    }
    async getCategoryTree() {
        const categories = await this.prisma.category.findMany({
            orderBy: [{ level: "asc" }, { sortOrder: "asc" }]
        });
        // Build tree in memory
        const byId = new Map();
        const roots = [];
        for (const c of categories) {
            byId.set(c.id, {
                id: c.id,
                name: c.name,
                path: c.path,
                isActive: c.isActive,
                children: []
            });
        }
        for (const c of categories) {
            const node = byId.get(c.id);
            if (c.parentId) {
                const parent = byId.get(c.parentId);
                if (parent) {
                    parent.children.push(node);
                }
            }
            else {
                roots.push(node);
            }
        }
        return roots;
    }
};
exports.AdminCatalogReadService = AdminCatalogReadService;
exports.AdminCatalogReadService = AdminCatalogReadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminCatalogReadService);
