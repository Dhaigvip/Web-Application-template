// src/modules/admin/catalog/admin-catalog-read.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AdminProductListResponseDto } from "./dto/admin-product-list.response.dto";
import { AdminProductDetailDto } from "./dto/admin-product-detail.dto";
import { AdminAttributeDto } from "./dto/admin-attribute.dto";
import { AdminProductListQueryDto } from "./dto/admin-product-list.query.dto";
import { AdminCategoryTreeNodeDto } from "./dto/admin-category-tree-node.dto";

@Injectable()
export class AdminCatalogReadService {
    constructor(private prisma: PrismaService) {}

    async getProductList(query: AdminProductListQueryDto): Promise<AdminProductListResponseDto> {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;

        const where: any = {};

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
                primaryCategoryPath: p.categories[0]?.category.path ?? null,
                updatedAt: p.updatedAt
            })),
            total,
            page,
            pageSize
        };
    }

    async getProductDetail(id: string): Promise<AdminProductDetailDto> {
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

        if (!product) throw new NotFoundException();

        return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            isActive: product.isActive,

            categories: product.categories.map((c) => ({
                id: c.category.id,
                path: c.category.path,
                isPrimary: c.isPrimary
            })),

            attributes: product.attributes.map((a) => ({
                code: a.attribute.code,
                type: a.attribute.type,
                value:
                    a.attribute.type === "ENUM"
                        ? a.attributeValue?.value ?? null
                        : a.attribute.type === "NUMBER"
                        ? a.valueNumber
                        : a.attribute.type === "BOOLEAN"
                        ? a.valueBoolean
                        : a.valueText
            }))
        };
    }

    async getAttributes(): Promise<AdminAttributeDto[]> {
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

    async getCategoryTree(): Promise<AdminCategoryTreeNodeDto[]> {
        const categories = await this.prisma.category.findMany({
            orderBy: [{ level: "asc" }, { sortOrder: "asc" }]
        });

        // Build tree in memory
        const byId = new Map<string, AdminCategoryTreeNodeDto>();
        const roots: AdminCategoryTreeNodeDto[] = [];

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
            const node = byId.get(c.id)!;

            if (c.parentId) {
                const parent = byId.get(c.parentId);
                if (parent) {
                    parent.children.push(node);
                }
            } else {
                roots.push(node);
            }
        }

        return roots;
    }
}
