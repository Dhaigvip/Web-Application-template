import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, Version } from "@nestjs/common";
import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { CartAddItemDto } from "./dto/cart-add-item.dto";
import { CartUpdateItemDto } from "./dto/cart-update-item.dto";
import { CART_ID_COOKIE, CART_ID_HEADER } from "./cart.constants";

export type VersionedRequest = Request & { version?: string };

@Controller("api/cart")
export class CartController {
    constructor(private cartService: CartService) {}

    // -----------------------
    // helpers
    // -----------------------

    private readCartId(req: Request): string | undefined {
        const cookieId = (req as any).cookies?.[CART_ID_COOKIE];
        const headerIdRaw = req.headers[CART_ID_HEADER] ?? req.headers[CART_ID_HEADER.toLowerCase()];
        const headerId = Array.isArray(headerIdRaw) ? headerIdRaw[0] : headerIdRaw;
        return (cookieId || headerId) as string | undefined;
    }

    private writeCartId(res: Response, cartId: string) {
        res.setHeader(CART_ID_HEADER, cartId);
        const isProd = process.env.NODE_ENV === "production";
        res.cookie(CART_ID_COOKIE, cartId, {
            httpOnly: false,
            sameSite: "lax",
            secure: isProd,
            path: "/"
        });
    }

    // -----------------------
    // endpoints
    // -----------------------

    @Version(["2"])
    @Get()
    async getCart(@Req() req: VersionedRequest, @Res({ passthrough: true }) res: Response) {
        const apiVersion = parseInt(req.version || "2") as 2;

        const cartId = this.readCartId(req);
        const cart = await this.cartService.getOrCreateCart(cartId, { apiVersion });

        this.writeCartId(res, cart.id);

        return this.cartService.getCartView(cart.id, { apiVersion });
    }

    @Version(["2"])
    @Post("items")
    async addItem(
        @Req() req: VersionedRequest,
        @Res({ passthrough: true }) res: Response,
        @Body() dto: CartAddItemDto
    ) {
        const apiVersion = parseInt(req.version || "2") as 2;

        const cartId = this.readCartId(req);
        const cart = await this.cartService.getOrCreateCart(cartId, { apiVersion });

        this.writeCartId(res, cart.id);

        return this.cartService.addItem(cart.id, dto, { apiVersion });
    }

    @Version(["2"])
    @Patch("items/:id")
    async updateItem(
        @Req() req: VersionedRequest,
        @Res({ passthrough: true }) res: Response,
        @Param("id") id: string,
        @Body() dto: CartUpdateItemDto
    ) {
        const apiVersion = parseInt(req.version || "2") as 2;

        const cartId = this.readCartId(req);
        const cart = await this.cartService.getOrCreateCart(cartId, { apiVersion });

        this.writeCartId(res, cart.id);

        return this.cartService.updateItem(cart.id, { itemId: id, quantity: dto.quantity }, { apiVersion });
    }

    @Version(["2"])
    @Delete("items/:id")
    async removeItem(@Req() req: VersionedRequest, @Res({ passthrough: true }) res: Response, @Param("id") id: string) {
        const apiVersion = parseInt(req.version || "2") as 2;

        const cartId = this.readCartId(req);
        const cart = await this.cartService.getOrCreateCart(cartId, { apiVersion });

        this.writeCartId(res, cart.id);

        return this.cartService.removeItem(cart.id, id, { apiVersion });
    }
}
