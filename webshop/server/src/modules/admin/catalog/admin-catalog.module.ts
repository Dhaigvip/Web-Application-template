import { Module } from "@nestjs/common";
import { AdminCatalogReadController } from "./admin-catalog-read.controller";
import { AdminCatalogReadService } from "./admin-catalog-read.service";
import { AdminCatalogService } from "./admin-catalog.service"; // write-side (already exists)
import { PrismaService } from "../../../prisma/prisma.service";
import { AdminCatalogController } from "./admin-catalog.controller";

@Module({
    controllers: [AdminCatalogReadController, AdminCatalogController],
    providers: [PrismaService, AdminCatalogReadService, AdminCatalogService]
})
export class AdminCatalogModule {}
