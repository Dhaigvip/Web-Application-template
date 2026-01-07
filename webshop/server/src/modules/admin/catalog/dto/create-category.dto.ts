import { IsString, IsOptional, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateCategoryDto {
    @IsOptional()
    @IsString()
    parentPath?: string;

    @IsString()
    slug!: string;

    @IsString()
    name!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number;
}
