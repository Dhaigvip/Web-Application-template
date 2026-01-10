import { Body, Controller, Delete, Param, Patch, Post, Put, UseGuards, Version } from "@nestjs/common";
import { AdminJwtGuard } from "../guards/admin-jwt.guard";
import { Roles } from "../decorators/roles.decorator";
import { AdminCatalogService } from "./admin-catalog.service";
import { RolesGuard } from "../guards/roles.guard";
import { ActiveAdminGuard } from "../guards/active-admin.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { AdminRole } from "@prisma/client";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AssignProductCategoryDto } from "./dto/assign-product-category.dto";
import { SetProductAttributeDto } from "./dto/set-product-attribute.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@UseGuards(AdminJwtGuard, ActiveAdminGuard, RolesGuard)
@Controller("api/admin/catalog")
export class AdminCatalogController {
    constructor(private service: AdminCatalogService) {}

    // PRODUCTS
    @Roles(AdminRole.CATALOG_ADMIN)
    @Version(["1", "2"])
    @Post("products")
    createProduct(@Body() dto: CreateProductDto) {
        return this.service.createProduct(dto);
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["1", "2"])
    @Patch("products/:id")
    updateProduct(@Param("id") id: string, @Body() dto: UpdateProductDto) {
        return this.service.updateProduct(id, dto);
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["1", "2"])
    @Post("products/:id/categories")
    assignCategory(@Param("id") id: string, @Body() dto: AssignProductCategoryDto) {
        return this.service.assignCategory(id, dto);
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["1", "2"])
    @Post("products/:id/attributes")
    setAttribute(@Param("id") id: string, @Body() dto: SetProductAttributeDto) {
        return this.service.setAttribute(id, dto);
    }

    @Roles(AdminRole.CATALOG_ADMIN)
    @Version(["1", "2"])
    @Post("products/:id/activate")
    activate(@Param("id") id: string) {
        return this.service.activateProduct(id);
    }

    @Roles(AdminRole.CATALOG_ADMIN)
    @Version(["1", "2"])
    @Post("products/:id/deactivate")
    deactivate(@Param("id") id: string) {
        return this.service.deactivateProduct(id);
    }

    // CATEGORIES
    @Roles(AdminRole.CATALOG_ADMIN)
    @Version(["1", "2"])
    @Post("categories")
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.service.createCategory(dto);
    }

    @Roles(AdminRole.CATALOG_ADMIN)
    @Version(["1", "2"])
    @Put("categories/:id")
    updateCategory(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
        return this.service.updateCategory(id, dto);
    }

    @Roles(AdminRole.CATALOG_ADMIN)
    @Version(["1", "2"])
    @Delete("categories/:id")
    deleteCategory(@Param("id") id: string) {
        return this.service.deleteCategory(id);
    }
}
