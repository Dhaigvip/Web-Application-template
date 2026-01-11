import { BadRequestException, Controller, Post, Req, Version } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { VersionedRequest } from "../cart/cart.controller.v2";

@Controller("api/checkout")
export class CheckoutController {
    constructor(private service: CheckoutService) {}

    @Version(["2"])
    @Post()
    checkout(@Req() req: VersionedRequest) {
        const apiVersion = parseInt(req.version || "2") as 2;

        const cartId = (req as any).cookies?.cartId || req.headers["x-cart-id"];

        if (!cartId) throw new BadRequestException("CART_ID_REQUIRED");

        return this.service.checkout(cartId, { apiVersion });
    }
}
