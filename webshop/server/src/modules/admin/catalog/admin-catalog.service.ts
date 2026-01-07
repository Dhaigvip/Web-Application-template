import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AssignProductCategoryDto } from "./dto/assign-product-category.dto";
import { SetProductAttributeDto } from "./dto/set-product-attribute.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class AdminCatalogService {
    constructor(private prisma: PrismaService) {}

    // PRODUCTS
    async createProduct(dto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                slug: dto.slug,
                name: dto.name,
                description: dto.description,
                isActive: false
            }
        });
    }

    async updateProduct(id: string, dto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: dto
        });
    }

    async assignCategory(productId: string, dto: AssignProductCategoryDto) {
        const category = await this.prisma.category.findUnique({
            where: { path: dto.categoryPath }
        });
        if (!category) throw new BadRequestException("Category not found");

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

    async setAttribute(productId: string, dto: SetProductAttributeDto) {
        const attribute = await this.prisma.attribute.findUnique({
            where: { code: dto.attributeCode },
            include: { values: true }
        });
        if (!attribute) throw new BadRequestException("Attribute not found");

        const base = {
            productId,
            attributeId: attribute.id
        };

        switch (attribute.type) {
            case "ENUM": {
                const val = attribute.values.find((v) => v.value === dto.value);
                if (!val) throw new BadRequestException("Invalid enum value");
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { attributeValueId: val.id },
                    create: { ...base, attributeValueId: val.id }
                });
            }

            case "NUMBER":
                if (typeof dto.value !== "number") throw new BadRequestException();
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { valueNumber: dto.value },
                    create: { ...base, valueNumber: dto.value }
                });

            case "BOOLEAN":
                if (typeof dto.value !== "boolean") throw new BadRequestException();
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { valueBoolean: dto.value },
                    create: { ...base, valueBoolean: dto.value }
                });

            case "TEXT":
                if (typeof dto.value !== "string") throw new BadRequestException();
                return this.prisma.productAttribute.upsert({
                    where: { productId_attributeId: base },
                    update: { valueText: dto.value },
                    create: { ...base, valueText: dto.value }
                });
        }
    }

    async activateProduct(id: string) {
        const hasPrimary = await this.prisma.productCategory.findFirst({
            where: { productId: id, isPrimary: true }
        });
        if (!hasPrimary) {
            throw new BadRequestException("Product needs a primary category");
        }

        return this.prisma.product.update({
            where: { id },
            data: { isActive: true }
        });
    }

    async deactivateProduct(id: string) {
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
    }

    // CATEGORIES
    async createCategory(dto: CreateCategoryDto) {
        let parent = null;

        if (dto.parentPath) {
            parent = await this.prisma.category.findUnique({
                where: { path: dto.parentPath }
            });
            if (!parent) throw new BadRequestException("Parent not found");
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

    async updateCategory(id: string, dto: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: { id },
            data: dto
        });
    }

    async deleteCategory(id: string) {
        const children = await this.prisma.category.findMany({
            where: { parentId: id }
        });

        if (children.length > 0) {
            throw new BadRequestException("Category has children and cannot be deleted");
        }

        return this.prisma.category.delete({ where: { id } });
    }
}
