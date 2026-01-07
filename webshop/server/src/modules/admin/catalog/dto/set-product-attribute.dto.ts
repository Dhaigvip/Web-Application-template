import { IsString, IsNotEmpty } from "class-validator";

export class SetProductAttributeDto {
    @IsString()
    @IsNotEmpty()
    attributeCode!: string;

    @IsNotEmpty()
    value!: string | number | boolean;
}
