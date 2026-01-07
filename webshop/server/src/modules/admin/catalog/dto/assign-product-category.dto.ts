import { IsString, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";

export class AssignProductCategoryDto {
  @IsString()
  categoryPath!: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (typeof value === 'boolean') return value;
    return value;
  })
  @IsBoolean()
  isPrimary!: boolean;
}
