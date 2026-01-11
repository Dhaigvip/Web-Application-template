import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { StripeService } from "../payments/stripe.service";

@Injectable()
export class CheckoutService {
    constructor(private prisma: PrismaService, private stripe: StripeService) {}

    async checkout(cartId: string, opts: { apiVersion: 2 }) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException("CART_EMPTY");
        }

        let totalCents = 0;
        const currency = cart.items[0].product.currency;

        for (const i of cart.items) {
            if (!i.product.isActive) {
                throw new BadRequestException("PRODUCT_INACTIVE");
            }
            totalCents += i.product.priceCents * i.quantity;
        }

        const order = await this.prisma.order.create({
            data: {
                currency,
                totalCents,
                status: "PENDING_PAYMENT",
                items: {
                    create: cart.items.map((i) => ({
                        productId: i.product.id,
                        name: i.product.name,
                        unitPriceCents: i.product.priceCents,
                        quantity: i.quantity,
                        imageUrl: i.product.imageUrl
                    }))
                }
            }
        });

        const intent = await this.stripe.createPaymentIntent(totalCents, currency, { orderId: order.id });

        await this.prisma.payment.create({
            data: {
                orderId: order.id,
                provider: "stripe",
                status: "INITIATED",
                amountCents: totalCents,
                currency,
                stripePaymentIntentId: intent.id
            }
        });

        return {
            orderId: order.id,
            clientSecret: intent.client_secret
        };
    }
}
