// ---------------------------
// CATEGORIES
// ---------------------------

export type CatalogCategoryTreeNode = {
    path: string; // Category.path (public identifier)
    slug: string;
    name: string;
    children: CatalogCategoryTreeNode[];
};

// ---------------------------
// LISTING
// ---------------------------

export type CatalogProductListItem = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
};

export type CatalogPagination = {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
};

export type CatalogAttributeFacetValue = {
    value: string; // AttributeValue.value
    count: number;
};

export type CatalogFacets = {
    attributes: Record<string, CatalogAttributeFacetValue[]>;
    price: null;
};

export type CatalogProductListResponse = {
    data: CatalogProductListItem[];
    pagination: CatalogPagination;
    facets: CatalogFacets;
};

// ---------------------------
// PDP
// ---------------------------

export type CatalogBreadcrumb = {
    path: string; // Category.path
    slug: string;
    name: string;
};

export type CatalogProductAttributeValue = {
    value: string; // AttributeValue.value
    label: string; // display
};

export type CatalogProductAttribute = {
    label: string; // Attribute.name
    values: CatalogProductAttributeValue[];
};

export type CatalogProductPdp = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
};

export type CatalogProductPdpResponse = {
    product: CatalogProductPdp;
    breadcrumbs: CatalogBreadcrumb[];
    attributes: Record<string, CatalogProductAttribute>;
};
