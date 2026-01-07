import { AdminProductListItemDto } from "./admin-product-list-item.dto";

export class AdminProductListResponseDto {
  declare items: AdminProductListItemDto[];
  declare total: number;
  declare page: number;
  declare pageSize: number;
}
