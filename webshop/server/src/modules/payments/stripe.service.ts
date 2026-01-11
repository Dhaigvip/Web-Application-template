// stripe.service.ts
import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-12-15.clover"
    });

    createPaymentIntent(amountCents: number, currency: string, metadata: any) {
        return this.stripe.paymentIntents.create({
            amount: amountCents,
            currency,
            metadata
        });
    }

    constructEvent(payload: Buffer, sig: string, secret: string) {
        return this.stripe.webhooks.constructEvent(payload, sig, secret);
    }
}
