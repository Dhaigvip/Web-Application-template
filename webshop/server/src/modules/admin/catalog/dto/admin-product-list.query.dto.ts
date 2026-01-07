import { IsOptional, IsString, IsBoolean, IsInt, Min, Max } from "class-validator";
import { Type, Transform } from "class-transformer";

export class AdminProductListQueryDto {
    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsString()
    categoryPath?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize?: number;
}
