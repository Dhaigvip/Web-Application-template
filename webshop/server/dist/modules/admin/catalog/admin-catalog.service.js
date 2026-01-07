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
exports.AdminCatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let AdminCatalogService = class AdminCatalogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // PRODUCTS
    async createProduct(dto) {
        return this.prisma.product.create({
            data: {
                slug: dto.slug,
                name: dto.name,
                description: dto.description,
                isActive: false
            }
        });
    }
    async updateProduct(id, dto) {
        return this.prisma.product.update({
            where: { id },
            data: dto
        });
    }
    async assignCategory(productId, dto) {
        const category = await this.prisma.category.findUnique({
            where: { path: dto.categoryPath }
        });
        if (!category)
            throw new common_1.BadRequestException("Category not found");
        if (dto.isPrimary) {
            await this.prisma.productCategory.updateMany({
                where: { productId },
                data: { isPrimary: false }
            });
        }
        return this.prisma.productCategory.upsert({
            where: {
                productId_categoryId: {
                    productId,
                    categoryId: category.id
                }
            },
            update: { isPrimary: dto.isPrimary },
            create: {
                productId,
                categoryId: category.id,
                isPrimary: dto.isPrimary
            }
        });
    }
    async setAttribute(productId, dto) {
        const attribute = await this.prisma.attribute.findUnique({
            where: { code: dto.attributeCode },
            include: { values: true }
        });
        if (!attribute)
            throw new common_1.BadRequestException("Attribute not found");
        const base = {
            productId,
            attributeId: attribute.id
        };
        switch (attribute.type) {
            case "ENUM": {
                const val = attribute.values.find((v) => v.value === dto.value);
                if (!val)
                    throw new common_1.BadRequestException("Invalid enum value");
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { attributeValueId: val.id },
                    create: { ...base, attributeValueId: val.id }
                });
            }
            case "NUMBER":
                if (typeof dto.value !== "number")
                    throw new common_1.BadRequestException();
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { valueNumber: dto.value },
                    create: { ...base, valueNumber: dto.value }
                });
            case "BOOLEAN":
                if (typeof dto.value !== "boolean")
                    throw new common_1.BadRequestException();
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { valueBoolean: dto.value },
                    create: { ...base, valueBoolean: dto.value }
                });
            case "TEXT":
                if (typeof dto.value !== "string")
                    throw new common_1.BadRequestException();
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { valueText: dto.value },
                    create: { ...base, valueText: dto.value }
                });
        }
    }
    async activateProduct(id) {
        const hasPrimary = await this.prisma.productCategory.findFirst({
            where: { productId: id, isPrimary: true }
        });
        if (!hasPrimary) {
            throw new common_1.BadRequestException("Product needs a primary category");
        }
        return this.prisma.product.update({
            where: { id },
            data: { isActive: true }
        });
    }
    async deactivateProduct(id) {
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
    }
    // CATEGORIES
    async createCategory(dto) {
        let parent = null;
        if (dto.parentPath) {
            parent = await this.prisma.category.findUnique({
                where: { path: dto.parentPath }
            });
            if (!parent)
                throw new common_1.BadRequestException("Parent not found");
        }
        const path = parent ? `${parent.path}/${dto.slug}` : dto.slug;
        return this.prisma.category.create({
            data: {
                slug: dto.slug,
                name: dto.name,
                path,
                level: parent ? parent.level + 1 : 0,
                parentId: parent?.id,
                sortOrder: dto.sortOrder ?? 0
            }
        });
    }
};
exports.AdminCatalogService = AdminCatalogService;
exports.AdminCatalogService = AdminCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminCatalogService);
