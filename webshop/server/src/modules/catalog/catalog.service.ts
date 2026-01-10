import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CategoryService } from "./category.service";
import { FacetService } from "./facet.service";
import { ProductService } from "./product.service";
import { CatalogProductListResponseDto } from "./dto/catalog-product-list.response.dto";
import { CatalogProductPdpResponseDto } from "./dto/catalog-product-pdp.response.dto";

@Injectable()
export class CatalogService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly categories: CategoryService,
        private readonly products: ProductService,
        private readonly facets: FacetService
    ) {}

    async getProducts(input: {
        category?: string;
        q?: string;
        attributes: Record<string, string[]>;
        priceMin?: number;
        priceMax?: number;
        sort: string;
        page: number;
        pageSize: number;
        includeInactive?: boolean;
        apiVersion: 1 | 2;
    }): Promise<CatalogProductListResponseDto> {
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

        const select: any = {
            id: true,
            slug: true,
            name: true,
            description: true
        };

        if (input.apiVersion === 2) {
            select.imageUrl = true;
        }

        const rows = await this.prisma.product.findMany({
            where,
            orderBy,
            skip: (input.page - 1) * input.pageSize,
            take: input.pageSize,
            select
        });

        return {
            data: rows.map((p) => {
                const base: any = {
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    description: p.description
                };

                if (input.apiVersion === 2) {
                    base.imageUrl = p.imageUrl;
                }

                return base;
            }),
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

    async getProductBySlug(
        slug: string,
        opts?: { includeInactive?: boolean; apiVersion: 1 | 2 }
    ): Promise<CatalogProductPdpResponseDto> {
        const includeInactive = opts?.includeInactive ?? false;

        const product = await this.products.getProductBySlug(slug, {
            includeInactive,
            apiVersion: opts?.apiVersion ?? 1
        });

        const primaryCategory = product.categories.find((c) => c.isPrimary)?.category;
        if (!primaryCategory) {
            throw new NotFoundException("PRIMARY_CATEGORY_NOT_FOUND");
        }

        // In B2C, if primary category is inactive, hide product (don’t leak).
        if (!includeInactive && !primaryCategory.isActive) {
            throw new NotFoundException("PRODUCT_NOT_FOUND");
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
                description: product.description,
                ...(opts?.apiVersion === 2 ? { imageUrl: product.imageUrl } : {})
            },
            breadcrumbs: breadcrumbs.map((b) => ({
                path: b.path,
                slug: b.slug,
                name: b.name
            })),
            attributes
        };
    }
}
