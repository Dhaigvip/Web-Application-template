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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoryService = class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ---------------------------
    // NAVIGATION
    // ---------------------------
    async getCategoryTree(opts) {
        const includeInactive = opts?.includeInactive ?? false;
        const rows = await this.prisma.category.findMany({
            where: includeInactive ? undefined : { isActive: true },
            select: {
                id: true,
                slug: true,
                name: true,
                parentId: true,
                path: true,
                sortOrder: true
            },
            orderBy: [{ level: "asc" }, { sortOrder: "asc" }]
        });
        const byId = new Map();
        const roots = [];
        for (const row of rows) {
            byId.set(row.id, {
                id: row.id,
                slug: row.slug,
                name: row.name,
                path: row.path,
                children: []
            });
        }
        for (const row of rows) {
            const node = byId.get(row.id);
            if (row.parentId) {
                const parent = byId.get(row.parentId);
                if (parent)
                    parent.children.push(node);
            }
            else {
                roots.push(node);
            }
        }
        return roots;
    }
    // ---------------------------
    // LISTING
    // ---------------------------
    /**
     * Resolves a category PATH to itself + all descendant IDs.
     * Example:
     *   electronics/phones → [phonesId, smartphonesId, ...]
     */
    async resolveCategoryScope(path, opts) {
        if (!path)
            return null;
        const includeInactive = opts?.includeInactive ?? false;
        const root = await this.prisma.category.findUnique({
            where: { path }, // public identifier
            select: { id: true }
        });
        if (!root)
            return [];
        const rows = await this.prisma.category.findMany({
            where: includeInactive ? undefined : { isActive: true },
            select: { id: true, parentId: true }
        });
        const ids = [];
        const stack = [root.id];
        while (stack.length) {
            const currentId = stack.pop();
            ids.push(currentId);
            for (const row of rows) {
                if (row.parentId === currentId) {
                    stack.push(row.id);
                }
            }
        }
        return ids;
    }
    // ---------------------------
    // PDP / BREADCRUMBS
    // ---------------------------
    /**
     * Builds breadcrumb path for a category ID (internal),
     * but returns ONLY public identifiers (Category.path) + display labels.
     */
    async getCategoryPath(categoryId, opts) {
        const includeInactive = opts?.includeInactive ?? false;
        const path = [];
        let currentId = categoryId;
        while (currentId) {
            const row = await this.prisma.category.findUnique({
                where: { id: currentId },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    parentId: true,
                    path: true,
                    isActive: true
                }
            });
            if (!row)
                break;
            // In B2C, if an ancestor is inactive, stop breadcrumbs (don’t leak hidden structure).
            if (!includeInactive && !row.isActive)
                break;
            path.unshift({
                path: row.path,
                slug: row.slug,
                name: row.name
            });
            currentId = row.parentId;
        }
        return path;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
