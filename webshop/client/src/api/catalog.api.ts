import { http } from "./http";
import type { CatalogCategoryTreeNode, CatalogProductListResponse, CatalogProductPdpResponse } from "./catalog.types";

export type CatalogProductsQuery = {
    category?: string; // Category.path
    q?: string;
    attributes?: Record<string, string[]>;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    page?: number;
    pageSize?: number;
};

export type ApiCallOptions = {
    /**
     * Optional: set this in dev if you want B2B visibility:
     * - backend checks x-api-key against process.env.B2B_API_KEY
     */
    apiKey?: string;
};

function buildProductsSearchParams(query: CatalogProductsQuery): URLSearchParams {
    const params = new URLSearchParams();

    if (query.category) params.set("category", query.category);
    if (query.q) params.set("q", query.q);

    // attributes as nested query params:
    // attr[color]=red,blue
    // (Matches your backend dto normalization)
    if (query.attributes) {
        for (const [code, values] of Object.entries(query.attributes)) {
            if (!values || values.length === 0) continue;
            params.set(`attributes[${code}]`, values.join(","));
        }
    }

    if (typeof query.priceMin === "number") params.set("priceMin", String(query.priceMin));
    if (typeof query.priceMax === "number") params.set("priceMax", String(query.priceMax));

    if (query.sort) params.set("sort", query.sort);
    if (typeof query.page === "number") params.set("page", String(query.page));
    if (typeof query.pageSize === "number") params.set("pageSize", String(query.pageSize));

    return params;
}

export function fetchCategoryTree() {
    return http<CatalogCategoryTreeNode[]>("/api/catalog/categories");
}

export function fetchProducts(query: CatalogProductsQuery) {
    const params = buildProductsSearchParams(query);
    const qs = params.toString();
    const path = qs ? `/api/catalog/products?${qs}` : "/api/catalog/products";
    return http<CatalogProductListResponse>(path);
}

export function fetchProductBySlug(slug: string) {
    const safeSlug = encodeURIComponent(slug);
    return http<CatalogProductPdpResponse>(`/api/catalog/products/${safeSlug}`);
}
