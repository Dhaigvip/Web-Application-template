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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogProductsQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CatalogProductsQueryDto {
    constructor() {
        this.sort = "relevance";
        this.page = 1;
        this.pageSize = 24;
    }
}
exports.CatalogProductsQueryDto = CatalogProductsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CatalogProductsQueryDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CatalogProductsQueryDto.prototype, "q", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => normalizeAttr(value)),
    __metadata("design:type", Object)
], CatalogProductsQueryDto.prototype, "attributes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CatalogProductsQueryDto.prototype, "priceMin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CatalogProductsQueryDto.prototype, "priceMax", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CatalogProductsQueryDto.prototype, "sort", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CatalogProductsQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CatalogProductsQueryDto.prototype, "pageSize", void 0);
/**
 * Converts:
 *  { color: 'red,blue' }
 *  { size: ['m', 'l'] }
 * into:
 *  { color: ['red','blue'], size: ['m','l'] }
 */
function normalizeAttr(value) {
    if (!value || typeof value !== "object")
        return {};
    const result = {};
    for (const [key, raw] of Object.entries(value)) {
        if (Array.isArray(raw)) {
            result[key] = raw
                .flatMap((v) => String(v).split(","))
                .map((v) => v.trim())
                .filter(Boolean);
        }
        else if (typeof raw === "string") {
            result[key] = raw
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
        }
    }
    return result;
}
