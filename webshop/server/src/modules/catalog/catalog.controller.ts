import { Controller, Get, Param, Query, Req, UseGuards, Version } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CatalogProductsQueryDto } from "./dto/catalog-products.query.dto";
import { CategoryService } from "./category.service";
import { CatalogProductListResponseDto } from "./dto/catalog-product-list.response.dto";
import { CatalogProductPdpResponseDto } from "./dto/catalog-product-pdp.response.dto";
import { CatalogCategoryTreeNodeDto } from "./dto/catalog-category-tree.response.dto";
import { VisibilityGuard, VisibilityRequest } from "../../common/visibility/visibility.guard";

@UseGuards(VisibilityGuard)
@Controller("api/catalog")
export class CatalogController {
    constructor(private readonly catalogService: CatalogService, private readonly categoryService: CategoryService) {}

    @Version(["1", "2"])
    @Get("products")
    getProducts(
        @Req() req: VisibilityRequest,
        @Query() query: CatalogProductsQueryDto
    ): Promise<CatalogProductListResponseDto> {
        const includeInactive = Boolean(req.visibility?.includeInactive);
        const apiVersion = parseInt(req.version || "1") as 1 | 2;

        return this.catalogService.getProducts({
            category: query.category,
            q: query.q,
            attributes: query.attributes ?? {},
            priceMin: query.priceMin,
            priceMax: query.priceMax,
            sort: query.sort,
            page: query.page,
            pageSize: query.pageSize,
            includeInactive,
            apiVersion
        });
    }

    @Version(["1", "2"])
    @Get("products/:slug")
    getProduct(@Req() req: VisibilityRequest, @Param("slug") slug: string): Promise<CatalogProductPdpResponseDto> {
        const includeInactive = Boolean(req.visibility?.includeInactive);
        const apiVersion = parseInt(req.version || "1") as 1 | 2;
        return this.catalogService.getProductBySlug(slug, { includeInactive, apiVersion });
    }

    @Version(["1", "2"])
    @Get("categories")
    getCategories(@Req() req: VisibilityRequest): Promise<CatalogCategoryTreeNodeDto[]> {
        const includeInactive = Boolean(req.visibility?.includeInactive);
        return this.categoryService.getCategoryTree({ includeInactive });
    }
}
