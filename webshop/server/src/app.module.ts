import { Module } from "@nestjs/common";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
    imports: [CatalogModule, AdminModule]
})
export class AppModule {}
