import { Controller, Version, Post, Req, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { StripeService } from "../payments/stripe.service";
import { VersionedRequest } from "../cart/cart.controller.v2";

@Controller("api/payments/stripe")
export class StripeWebhookController {
    constructor(private prisma: PrismaService, private stripeService: StripeService) {}

    @Version(["1", "2"])
    @Post("webhook")
    async handleWebhook(@Req() req: VersionedRequest) {
        const sig = req.headers["stripe-signature"] as string;

        if (!sig) {
            throw new BadRequestException("MISSING_SIGNATURE");
        }

        const event = this.stripeService.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

        switch (event.type) {
            case "payment_intent.succeeded":
                await this.handleSuccess(event.data.object as any);
                break;

            case "payment_intent.payment_failed":
                await this.handleFailure(event.data.object as any);
                break;
        }

        return { received: true };
    }

    private async handleSuccess(intent: any) {
        const payment = await this.prisma.payment.findUnique({
            where: { stripePaymentIntentId: intent.id }
        });

        if (!payment) return;

        if (payment.status === "SUCCEEDED") return; // replay safe

        await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "SUCCEEDED",
                    rawEvent: intent
                }
            }),
            this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: "PAID" }
            })
        ]);
    }

    private async handleFailure(intent: any) {
        const payment = await this.prisma.payment.findUnique({
            where: { stripePaymentIntentId: intent.id }
        });

        if (!payment) return;

        await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: "FAILED",
                    rawEvent: intent
                }
            }),
            this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: "PAYMENT_FAILED" }
            })
        ]);
    }
}
