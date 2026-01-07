import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../guards/admin-jwt.guard";
import { ActiveAdminGuard } from "../guards/active-admin.guard";
import { RolesGuard } from "../guards/roles.guard";
import { AdminProductListResponseDto } from "./dto/admin-product-list.response.dto";
import { AdminProductDetailDto } from "./dto/admin-product-detail.dto";
import { Roles } from "../decorators/roles.decorator";
import { AdminRole } from "@prisma/client";
import { AdminCategoryTreeNodeDto } from "./dto/admin-category-tree-node.dto";
import { AdminAttributeDto } from "./dto/admin-attribute.dto";
import { AdminCatalogReadService } from "./admin-catalog-read.service";
import { AdminProductListQueryDto } from "./dto/admin-product-list.query.dto";

@UseGuards(AdminJwtGuard, ActiveAdminGuard, RolesGuard)
@Controller("api/admin/catalog")
export class AdminCatalogReadController {
    constructor(private service: AdminCatalogReadService) {}

    @Roles(AdminRole.CONTENT_EDITOR)
    @Get("products")
    getProducts(@Query() query: AdminProductListQueryDto): Promise<AdminProductListResponseDto> {
        return this.service.getProductList(query);
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Get("products/:id")
    getProduct(@Param("id") id: string): Promise<AdminProductDetailDto> {
        return this.service.getProductDetail(id);
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Get("categories")
    getCategories(): Promise<AdminCategoryTreeNodeDto[]> {
        return this.service.getCategoryTree();
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Get("attributes")
    getAttributes(): Promise<AdminAttributeDto[]> {
        return this.service.getAttributes();
    }
}
