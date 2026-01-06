export class CatalogBreadcrumbDto {
    path!: string; // Category.path (public identifier)
    slug!: string;
    name!: string;
}

export class CatalogProductAttributeValueDto {
    value!: string; // AttributeValue.value
    label!: string; // display
}

export class CatalogProductAttributeDto {
    label!: string; // Attribute.name
    values!: CatalogProductAttributeValueDto[];
}

export class CatalogProductPdpDto {
    id!: string;
    slug!: string;
    name!: string;
    description!: string | null;
}

export class CatalogProductPdpResponseDto {
    product!: CatalogProductPdpDto;
    breadcrumbs!: CatalogBreadcrumbDto[];
    attributes!: Record<string, CatalogProductAttributeDto>;
}
