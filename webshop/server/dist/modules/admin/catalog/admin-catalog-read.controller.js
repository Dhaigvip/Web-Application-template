"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCatalogReadController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_guard_1 = require("../guards/admin-jwt.guard");
const active_admin_guard_1 = require("../guards/active-admin.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const client_1 = require("@prisma/client");
const admin_catalog_read_service_1 = require("./admin-catalog-read.service");
const admin_product_list_query_dto_1 = require("./dto/admin-product-list.query.dto");
let AdminCatalogReadController = class AdminCatalogReadController {
    constructor(service) {
        this.service = service;
    }
    getProducts(query) {
        return this.service.getProductList(query);
    }
    getProduct(id) {
        return this.service.getProductDetail(id);
    }
    getCategories() {
        return this.service.getCategoryTree();
    }
    getAttributes() {
        return this.service.getAttributes();
    }
};
exports.AdminCatalogReadController = AdminCatalogReadController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Get)("products"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_product_list_query_dto_1.AdminProductListQueryDto]),
    __metadata("design:returntype", Promise)
], AdminCatalogReadController.prototype, "getProducts", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Get)("products/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCatalogReadController.prototype, "getProduct", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Get)("categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCatalogReadController.prototype, "getCategories", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Get)("attributes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCatalogReadController.prototype, "getAttributes", null);
exports.AdminCatalogReadController = AdminCatalogReadController = __decorate([
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard, active_admin_guard_1.ActiveAdminGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("api/admin/catalog"),
    __metadata("design:paramtypes", [admin_catalog_read_service_1.AdminCatalogReadService])
], AdminCatalogReadController);
