import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

export type CategoryNode = {
    id: string;
    slug: string;
    name: string;
    path: string; // public identifier
    children: CategoryNode[];
};

export type CategoryPathItem = {
    path: string; // public identifier
    slug: string;
    name: string;
};

type CategoryRow = {
    id: string;
    slug: string;
    name: string;
    parentId: string | null;
    path: string;
};

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    // ---------------------------
    // NAVIGATION
    // ---------------------------

    async getCategoryTree(opts?: { includeInactive?: boolean }): Promise<CategoryNode[]> {
        const includeInactive = opts?.includeInactive ?? false;

        const rows: Array<CategoryRow & { sortOrder: number }> = await this.prisma.category.findMany({
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

        const byId = new Map<string, CategoryNode>();
        const roots: CategoryNode[] = [];

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
            const node = byId.get(row.id)!;
            if (row.parentId) {
                const parent = byId.get(row.parentId);
                if (parent) parent.children.push(node);
            } else {
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
    async resolveCategoryScope(path?: string, opts?: { includeInactive?: boolean }): Promise<string[] | null> {
        if (!path) return null;

        const includeInactive = opts?.includeInactive ?? false;

        const root: { id: string } | null = await this.prisma.category.findUnique({
            where: { path }, // public identifier
            select: { id: true }
        });

        if (!root) return [];

        const rows: { id: string; parentId: string | null }[] = await this.prisma.category.findMany({
            where: includeInactive ? undefined : { isActive: true },
            select: { id: true, parentId: true }
        });

        const ids: string[] = [];
        const stack: string[] = [root.id];

        while (stack.length) {
            const currentId = stack.pop()!;
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
    async getCategoryPath(categoryId: string, opts?: { includeInactive?: boolean }): Promise<CategoryPathItem[]> {
        const includeInactive = opts?.includeInactive ?? false;

        const path: CategoryPathItem[] = [];
        let currentId: string | null = categoryId;

        while (currentId) {
            const row: (CategoryRow & { isActive: boolean }) | null = await this.prisma.category.findUnique({
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

            if (!row) break;

            // In B2C, if an ancestor is inactive, stop breadcrumbs (don’t leak hidden structure).
            if (!includeInactive && !row.isActive) break;

            path.unshift({
                path: row.path,
                slug: row.slug,
                name: row.name
            });

            currentId = row.parentId;
        }

        return path;
    }
}
