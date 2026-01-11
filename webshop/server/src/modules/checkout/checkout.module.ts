import { CheckoutController } from "./checkout.controller.v2";
import { CheckoutService } from "./checkout.service";
import { StripeService } from "../payments/stripe.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [CheckoutController],
    providers: [CheckoutService, StripeService, PrismaService],
    exports: [CheckoutService]
})
export class CheckoutModule {}
