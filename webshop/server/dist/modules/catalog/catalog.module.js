"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogModule = void 0;
const common_1 = require("@nestjs/common");
const catalog_controller_1 = require("./catalog.controller");
const category_service_1 = require("./category.service");
const catalog_service_1 = require("./catalog.service");
const product_service_1 = require("./product.service");
const facet_service_1 = require("./facet.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const visibility_guard_1 = require("../../common/visibility/visibility.guard");
let CatalogModule = class CatalogModule {
};
exports.CatalogModule = CatalogModule;
exports.CatalogModule = CatalogModule = __decorate([
    (0, common_1.Module)({
        controllers: [catalog_controller_1.CatalogController],
        providers: [prisma_service_1.PrismaService, category_service_1.CategoryService, catalog_service_1.CatalogService, product_service_1.ProductService, facet_service_1.FacetService, visibility_guard_1.VisibilityGuard]
    })
], CatalogModule);
