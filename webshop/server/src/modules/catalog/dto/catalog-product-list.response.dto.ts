export class CatalogProductListItemDto {
    id!: string;
    slug!: string;
    name!: string;
    description!: string | null;
}

export class CatalogPaginationDto {
    page!: number;
    pageSize!: number;
    totalItems!: number;
    totalPages!: number;
}

export class CatalogAttributeFacetValueDto {
    value!: string; // AttributeValue.value
    count!: number;
}

export class CatalogFacetsDto {
    attributes!: Record<string, CatalogAttributeFacetValueDto[]>;
    price!: null;
}

export class CatalogProductListResponseDto {
    data!: CatalogProductListItemDto[];
    pagination!: CatalogPaginationDto;
    facets!: CatalogFacetsDto;
}
