export class AdminProductListItemDto {
    declare id: string;
    declare slug: string;
    declare name: string;
    declare isActive: boolean;
    declare primaryCategoryPath: string | null;
    declare updatedAt: Date;
}
