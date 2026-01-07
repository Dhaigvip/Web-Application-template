export class AdminCategoryTreeNodeDto {
    declare id: string;
    declare name: string;
    declare path: string;
    declare isActive: boolean;
    declare children: AdminCategoryTreeNodeDto[];
}
