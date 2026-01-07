"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCatalogModule = void 0;
const common_1 = require("@nestjs/common");
const admin_catalog_read_controller_1 = require("./admin-catalog-read.controller");
const admin_catalog_read_service_1 = require("./admin-catalog-read.service");
const admin_catalog_service_1 = require("./admin-catalog.service"); // write-side (already exists)
const prisma_service_1 = require("../../../prisma/prisma.service");
const admin_catalog_controller_1 = require("./admin-catalog.controller");
let AdminCatalogModule = class AdminCatalogModule {
};
exports.AdminCatalogModule = AdminCatalogModule;
exports.AdminCatalogModule = AdminCatalogModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_catalog_read_controller_1.AdminCatalogReadController, admin_catalog_controller_1.AdminCatalogController],
        providers: [prisma_service_1.PrismaService, admin_catalog_read_service_1.AdminCatalogReadService, admin_catalog_service_1.AdminCatalogService]
    })
], AdminCatalogModule);
