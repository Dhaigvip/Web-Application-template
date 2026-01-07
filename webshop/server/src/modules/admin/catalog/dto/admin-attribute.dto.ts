export class AdminAttributeDto {
  declare code: string;
  declare name: string;
  declare type: string;
  declare isFilterable: boolean;
  declare isFacetable: boolean;
  declare values?: {
    value: string;
    label: string;
  }[];
}
