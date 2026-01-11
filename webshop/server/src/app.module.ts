import { Module } from "@nestjs/common";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { AdminModule } from "./modules/admin/admin.module";
import { CartModule } from "./modules/cart/cart.module";
import { CheckoutModule } from "./modules/checkout/checkout.module";
import { PaymentModule } from "./modules/payments/payment.module";

@Module({
    imports: [CatalogModule, AdminModule, CartModule, CheckoutModule, PaymentModule]
})
export class AppModule {}
