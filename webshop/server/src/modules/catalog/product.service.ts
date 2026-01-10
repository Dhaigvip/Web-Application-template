import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}

    // ---------------------------
    // LISTING HELPERS
    // ---------------------------

    buildBaseQuery(filters: {
        categoryIds?: string[] | null;
        search?: string;
        priceMin?: number;
        priceMax?: number;
        includeInactive?: boolean;
    }): Prisma.ProductWhereInput {
        const includeInactive = filters.includeInactive ?? false;

        const where: Prisma.ProductWhereInput = includeInactive
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

    applyAttributeFilters(
        where: Prisma.ProductWhereInput,
        attributes: Record<string, string[]>
    ): Prisma.ProductWhereInput {
        if (!attributes || Object.keys(attributes).length === 0) return where;

        const andClauses: Prisma.ProductWhereInput[] = Object.entries(attributes)
            .filter(([_, values]) => Array.isArray(values) && values.length > 0)
            .map(([attributeCode, values]) => ({
                attributes: {
                    some: {
                        attribute: { code: attributeCode, isFilterable: true },
                        attributeValue: { value: { in: values } }
                    }
                }
            }));

        if (andClauses.length === 0) return where;

        return {
            ...where,
            AND: [...(where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : []), ...andClauses]
        };
    }

    applySorting(sort: string): Prisma.ProductOrderByWithRelationInput[] {
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

    async getProductBySlug(slug: string, opts?: { includeInactive?: boolean, apiVersion: 1 | 2 }) {
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

        if (!product) throw new NotFoundException("PRODUCT_NOT_FOUND");
        return product;
    }

    async getProductAttributes(productId: string) {
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

        const attributes: Record<string, { label: string; values: { value: string; label: string }[] }> = {};

        for (const row of rows) {
            if (!row.attributeValue) continue;

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
}
