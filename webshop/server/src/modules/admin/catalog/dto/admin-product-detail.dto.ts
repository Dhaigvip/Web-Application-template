export class AdminProductDetailDto {
    declare id: string;
    declare slug: string;
    declare name: string;
    declare description: string | null;
    declare isActive: boolean;

    declare categories: {
        id: string;
        path: string;
        isPrimary: boolean;
    }[];

    declare attributes: {
        code: string;
        type: string;
        value: string | number | boolean | null;
    }[];
}
