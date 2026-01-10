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
exports.AdminCatalogV2Controller = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const admin_jwt_guard_1 = require("../guards/admin-jwt.guard");
const active_admin_guard_1 = require("../guards/active-admin.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../prisma/prisma.service");
const upload_utils_1 = require("../../../common/uploads/upload.utils");
let AdminCatalogV2Controller = class AdminCatalogV2Controller {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadProductImage(id, file) {
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        const publicBase = (process.env.PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
        const imagePath = `/uploads/products/${file.filename}`;
        const imageUrl = publicBase ? `${publicBase}${imagePath}` : imagePath;
        // Ensure product exists + update
        const updated = await this.prisma.product.update({
            where: { id },
            data: { imageUrl },
            select: { id: true, imageUrl: true }
        });
        return updated;
    }
};
exports.AdminCatalogV2Controller = AdminCatalogV2Controller;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.AdminRole.CONTENT_EDITOR),
    (0, common_1.Post)("products/:id/image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, upload_utils_1.productImageStorage)(),
        fileFilter: upload_utils_1.imageFileFilter,
        limits: {
            fileSize: Number(process.env.MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024) // default 5MB
        }
    })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminCatalogV2Controller.prototype, "uploadProductImage", null);
exports.AdminCatalogV2Controller = AdminCatalogV2Controller = __decorate([
    (0, common_1.UseGuards)(admin_jwt_guard_1.AdminJwtGuard, active_admin_guard_1.ActiveAdminGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({
        path: "api/admin/catalog",
        version: "2"
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminCatalogV2Controller);
