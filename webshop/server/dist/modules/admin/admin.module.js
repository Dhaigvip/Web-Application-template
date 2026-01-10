"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_controller_1 = require("./auth/admin-auth.controller");
const admin_auth_service_1 = require("./auth/admin-auth.service");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const roles_guard_1 = require("./guards/roles.guard");
const active_admin_guard_1 = require("./guards/active-admin.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
const admin_catalog_service_1 = require("./catalog/admin-catalog.service");
const admin_catalog_controller_1 = require("./catalog/admin-catalog.controller");
const admin_catalog_read_controller_1 = require("./catalog/admin-catalog-read.controller");
const admin_catalog_module_1 = require("./catalog/admin-catalog.module");
const admin_auth_module_1 = require("./auth/admin-auth.module");
const admin_catalog_read_service_1 = require("./catalog/admin-catalog-read.service");
// src/modules/admin/admin.module.ts
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [admin_auth_module_1.AdminAuthModule, admin_catalog_module_1.AdminCatalogModule],
        controllers: [admin_auth_controller_1.AdminAuthController, admin_catalog_controller_1.AdminCatalogController, admin_catalog_read_controller_1.AdminCatalogReadController],
        providers: [admin_auth_service_1.AdminAuthService, admin_catalog_service_1.AdminCatalogService, admin_catalog_read_service_1.AdminCatalogReadService, jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard, active_admin_guard_1.ActiveAdminGuard, prisma_service_1.PrismaService]
    })
], AdminModule);
