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
exports.AdminCatalogController = void 0;
const common_1 = require("@nestjs/common");
const admin_jwt_guard_1 = require("../guards/admin-jwt.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const admin_catalog_service_1 = require("./admin-catalog.service");
const roles_guard_1 = require("../guards/roles.guard");
const active_admin_guard_1 = require("../guards/active-admin.guard");
const create_product_dto_1 = require("./dto/create-product.dto");
const client_1 = require("@prisma/client");
const update_product_dto_1 = require("./dto/update-product.dto");
const assign_product_category_dto_1 = require("./dto/assign-product-category.dto");
const set_product_attribute_dto_1 = require("./dto/set-product-attribute.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
let AdminCatalogController = class AdminCatalogController {
    constructor(service) {
        this.service = service;
    }
    // PRODUCTS
    createProduct(dto) {
        return this.service.createProduct(dto);
    }
    updateProduct(id, dto) {
        return this.service.updateProduct(id, dto);
    }
    assignCategory(id, dto) {
        return this.service.assignCategory(id, dto);
    }
    setAttribute(id, dto) {
        return this.service.setAttribute(id, dto);
    }
    activate(id) {
        return this.service.activateProduct(id);
    }
    deactivate(id) {
        return this.service.deactivateProduct(id);
    }
    // CATEGORIES
    createCategory(dto) {
        return this.service.createCategory(dto);
    }
};
exports.AdminCatalogController = AdminCatalogController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CATALOG_ADMIN),
    (0, common_1.Post)("products"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], AdminCatalogController.prototype, "createProduct", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Patch)("products/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], AdminCatalogController.prototype, "updateProduct", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Post)("products/:id/categories"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_product_category_dto_1.AssignProductCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminCatalogController.prototype, "assignCategory", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Post)("products/:id/attributes"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_product_attribute_dto_1.SetProductAttributeDto]),
    __metadata("design:returntype", void 0)
], AdminCatalogController.prototype, "setAttribute", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CATALOG_ADMIN),
    (0, common_1.Post)("products/:id/activate"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminCatalogController.prototype, "activate", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CATALOG_ADMIN),
    (0, common_1.Post)("products/:id/deactivate"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminCatalogController.prototype, "deactivate", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CATALOG_ADMIN),
    (0, common_1.Post)("categories"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminCatalogController.prototype, "createCategory", null);
exports.AdminCatalogController = AdminCatalogController = __decorate([
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard, active_admin_guard_1.ActiveAdminGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("api/admin/catalog"),
    __metadata("design:paramtypes", [admin_catalog_service_1.AdminCatalogService])
], AdminCatalogController);
