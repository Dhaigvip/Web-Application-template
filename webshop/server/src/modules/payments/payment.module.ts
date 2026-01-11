import { Module } from "@nestjs/common";
import { StripeWebhookController } from "../webhooks/stripe-webhook-controller";
import { StripeService } from "./stripe.service";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
    controllers: [StripeWebhookController],
    providers: [StripeService, PrismaService]
})
export class PaymentModule {}
