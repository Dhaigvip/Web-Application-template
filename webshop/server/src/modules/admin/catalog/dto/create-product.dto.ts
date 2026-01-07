import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;
}
