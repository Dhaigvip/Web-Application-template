export class CatalogCategoryTreeNodeDto {
    path!: string; // public identifier
    slug!: string;
    name!: string;
    children!: CatalogCategoryTreeNodeDto[];
}
