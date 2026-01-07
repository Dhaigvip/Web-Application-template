import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminAuthController } from "./auth/admin-auth.controller";
import { AdminAuthService } from "./auth/admin-auth.service";
import { JwtStrategy } from "./auth/jwt.strategy";
import { RolesGuard } from "./guards/roles.guard";
import { ActiveAdminGuard } from "./guards/active-admin.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminCatalogService } from "./catalog/admin-catalog.service";
import { AdminCatalogController } from "./catalog/admin-catalog.controller";
import { AdminCatalogReadController } from "./catalog/admin-catalog-read.controller";
import { AdminCatalogModule } from "./catalog/admin-catalog.module";
import { AdminAuthModule } from "./auth/admin-auth.module";
import { AdminCatalogReadService } from "./catalog/admin-catalog-read.service";

// src/modules/admin/admin.module.ts
@Module({
    imports: [AdminAuthModule, AdminCatalogModule],
    controllers: [AdminAuthController, AdminCatalogController, AdminCatalogReadController],
    providers: [AdminAuthService, AdminCatalogService, AdminCatalogReadService, JwtStrategy, RolesGuard, ActiveAdminGuard, PrismaService]
})
export class AdminModule {}
