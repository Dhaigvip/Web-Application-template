import { IsInt, Min } from "class-validator";

export class CartUpdateItemDto {
    @IsInt()
    @Min(0) // 0 => remove item
    quantity!: number;
}
