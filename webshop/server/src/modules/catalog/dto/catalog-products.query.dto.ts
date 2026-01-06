import { IsOptional, IsString, IsNumber, IsInt, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

export class CatalogProductsQueryDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    q?: string;

    // attr[color]=red,blue
    @IsOptional()
    @Transform(({ value }) => normalizeAttr(value))
    attributes?: Record<string, string[]>;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    priceMin?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    priceMax?: number;

    @IsOptional()
    @IsString()
    sort: string = "relevance";

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page: number = 1;

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number = 24;
}

/**
 * Converts:
 *  { color: 'red,blue' }
 *  { size: ['m', 'l'] }
 * into:
 *  { color: ['red','blue'], size: ['m','l'] }
 */
function normalizeAttr(value: unknown): Record<string, string[]> {
    if (!value || typeof value !== "object") return {};

    const result: Record<string, string[]> = {};

    for (const [key, raw] of Object.entries(value)) {
        if (Array.isArray(raw)) {
            result[key] = raw
                .flatMap((v) => String(v).split(","))
                .map((v) => v.trim())
                .filter(Boolean);
        } else if (typeof raw === "string") {
            result[key] = raw
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
        }
    }

    return result;
}
