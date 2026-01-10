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
exports.CatalogController = void 0;
const common_1 = require("@nestjs/common");
const catalog_service_1 = require("./catalog.service");
const catalog_products_query_dto_1 = require("./dto/catalog-products.query.dto");
const category_service_1 = require("./category.service");
const visibility_guard_1 = require("../../common/visibility/visibility.guard");
let CatalogController = class CatalogController {
    constructor(catalogService, categoryService) {
        this.catalogService = catalogService;
        this.categoryService = categoryService;
    }
    getProducts(req, query) {
        const includeInactive = Boolean(req.visibility?.includeInactive);
        return this.catalogService.getProducts({
            category: query.category,
            q: query.q,
            attributes: query.attributes ?? {},
            priceMin: query.priceMin,
            priceMax: query.priceMax,
            sort: query.sort,
            page: query.page,
            pageSize: query.pageSize,
            includeInactive,
            apiVersion: 1
        });
    }
    getProduct(req, slug) {
        const includeInactive = Boolean(req.visibility?.includeInactive);
        return this.catalogService.getProductBySlug(slug, { includeInactive, apiVersion: 1 });
    }
    getCategories(req) {
        const includeInactive = Boolean(req.visibility?.includeInactive);
        return this.categoryService.getCategoryTree({ includeInactive });
    }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, common_1.Get)("products"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, catalog_products_query_dto_1.CatalogProductsQueryDto]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)("products/:slug"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Get)("categories"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getCategories", null);
exports.CatalogController = CatalogController = __decorate([
    (0, common_1.UseGuards)(visibility_guard_1.VisibilityGuard),
    (0, common_1.Controller)({
        path: "api/catalog",
        version: "1"
    }),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService, category_service_1.CategoryService])
], CatalogController);
