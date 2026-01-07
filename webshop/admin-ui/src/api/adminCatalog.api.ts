import { http } from "./http";

export interface AdminProductListItemDto {
    id: string;
    slug: string;
    name: string;
    isActive: boolean;
    primaryCategoryPath: string | null;
    updatedAt: string;
}

export interface AdminProductListResponseDto {
    items: AdminProductListItemDto[];
    total: number;
    page: number;
    pageSize: number;
}

export interface AdminProductListQuery {
    q?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
}

// --- DETAIL ---
export interface AdminProductDetailDto {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    isActive: boolean;

    categories: {
        id: string;
        path: string;
        isPrimary: boolean;
    }[];

    attributes: {
        code: string;
        type: "ENUM" | "NUMBER" | "BOOLEAN" | "TEXT";
        value: string | number | boolean | null;
    }[];
}

export function getAdminProducts(query: AdminProductListQuery) {
    const params = new URLSearchParams();

    if (query.q) params.set("q", query.q);
    if (query.isActive !== undefined) params.set("isActive", String(query.isActive));
    if (query.page) params.set("page", String(query.page));
    if (query.pageSize) params.set("pageSize", String(query.pageSize));

    return http<AdminProductListResponseDto>(`/api/admin/catalog/products?${params.toString()}`);
}

export function getAdminProduct(id: string) {
    return http<AdminProductDetailDto>(`/api/admin/catalog/products/${id}`);
}

// --- COMMANDS ---
export function updateAdminProduct(id: string, dto: { name?: string; description?: string }) {
    return http<void>(`/api/admin/catalog/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dto)
    });
}

export function activateAdminProduct(id: string) {
    return http<void>(`/api/admin/catalog/products/${id}/activate`, {
        method: "POST"
    });
}

export function deactivateAdminProduct(id: string) {
    return http<void>(`/api/admin/catalog/products/${id}/deactivate`, {
        method: "POST"
    });
}

export interface AdminCategoryTreeNodeDto {
    id: string;
    name: string;
    path: string;
    isActive: boolean;
    children: AdminCategoryTreeNodeDto[];
}

export function getAdminCategories() {
    return http<AdminCategoryTreeNodeDto[]>("/api/admin/catalog/categories");
}

export function assignAdminProductCategory(productId: string, dto: { categoryPath: string; isPrimary: boolean }) {
    return http<void>(`/api/admin/catalog/products/${productId}/categories`, {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

// -----------------------------
// Categories — CREATE
// -----------------------------

export interface AdminCreateCategoryDto {
    name: string;
    slug: string;
    parentPath?: string;
}

export function createAdminCategory(dto: AdminCreateCategoryDto) {
    return http<void>("/api/admin/catalog/categories", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

// -----------------------------
// Products — CREATE
// -----------------------------

export interface AdminCreateProductDto {
    name: string;
    slug: string;
}

export interface AdminCreateProductResponseDto {
    id: string;
}

export function createAdminProduct(dto: AdminCreateProductDto) {
    return http<AdminCreateProductResponseDto>("/api/admin/catalog/products", {
        method: "POST",
        body: JSON.stringify(dto)
    });
}

export interface UpdateAdminCategoryPayload {
    name: string;
    slug: string;
    parentPath?: string;
    isActive: boolean;
}

export function updateAdminCategory(id: string, payload: UpdateAdminCategoryPayload) {
    return http<void>(`/api/admin/catalog/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export function deleteAdminCategory(id: string) {
    return http<void>(`/api/admin/catalog/categories/${id}`, {
        method: "DELETE"
    });
}
