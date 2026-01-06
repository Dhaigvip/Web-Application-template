import { Module } from "@nestjs/common";
import { CatalogController } from "./catalog.controller";
import { CategoryService } from "./category.service";
import { CatalogService } from "./catalog.service";
import { ProductService } from "./product.service";
import { FacetService } from "./facet.service";
import { PrismaService } from "../../prisma/prisma.service";
import { VisibilityGuard } from "../../common/visibility/visibility.guard";

@Module({
    controllers: [CatalogController],
    providers: [PrismaService, CategoryService, CatalogService, ProductService, FacetService, VisibilityGuard]
})
export class CatalogModule {}
