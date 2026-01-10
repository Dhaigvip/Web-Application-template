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

    @IsOptional()
    @IsString()
    // If you want strict URL validation:
    // @IsUrl({ require_tld: false })
    imageUrl?: string;
}
