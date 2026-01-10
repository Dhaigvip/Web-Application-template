import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Version
} from "@nestjs/common";
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
import { PrismaService } from "../../../prisma/prisma.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageFileFilter, productImageStorage } from "../../../common/uploads/upload.utils";
import { VersionedRequest } from "../../../common/interceptors/version.interceptor";

@UseGuards(AdminJwtGuard, ActiveAdminGuard, RolesGuard)
@Controller("api/admin/catalog")
export class AdminCatalogReadController {
    constructor(private service: AdminCatalogReadService, private prisma: PrismaService) {}

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["1", "2"])
    @Get("products")
    getProducts(@Query() query: AdminProductListQueryDto, @Req() req: VersionedRequest): Promise<AdminProductListResponseDto> {
        const apiVersion = parseInt(req.version || "1") as 1 | 2;
        return this.service.getProductList(query, { apiVersion });
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["1", "2"])
    @Get("products/:id")
    getProduct(@Param("id") id: string, @Req() req: VersionedRequest): Promise<AdminProductDetailDto> {
        const apiVersion = parseInt(req.version || "1") as 1 | 2;
        return this.service.getProductDetail(id, { apiVersion });
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["1", "2"])
    @Get("categories")
    getCategories(): Promise<AdminCategoryTreeNodeDto[]> {
        return this.service.getCategoryTree();
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["1", "2"])
    @Get("attributes")
    getAttributes(): Promise<AdminAttributeDto[]> {
        return this.service.getAttributes();
    }

    @Roles(AdminRole.CONTENT_EDITOR)
    @Version(["2"])
    @Post("products/:id/image")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: productImageStorage(),
            fileFilter: imageFileFilter,
            limits: {
                fileSize: Number(process.env.MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024)
            }
        })
    )
    async uploadProductImage(@Param("id") id: string, @UploadedFile() file?: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException("File is required");
        }

        const publicBase = (process.env.PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
        const imagePath = `/uploads/products/${file.filename}`;
        const imageUrl = publicBase ? `${publicBase}${imagePath}` : imagePath;

        return this.prisma.product.update({
            where: { id },
            data: { imageUrl },
            select: { id: true, imageUrl: true }
        });
    }
}
