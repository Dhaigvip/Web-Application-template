import { IsInt, IsString, IsUUID, Min } from "class-validator";

export class CartAddItemDto {
    @IsUUID()
    productId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;
}
