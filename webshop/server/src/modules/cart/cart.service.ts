import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { CartAddItemDto } from "./dto/cart-add-item.dto";

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getOrCreateCart(cartId?: string, _opts?: { apiVersion: 2 }) {
        if (cartId) {
            const existing = await this.prisma.cart.findUnique({ where: { id: cartId } });
            if (existing) return existing;
        }
        return this.prisma.cart.create({ data: {} });
    }

    async getCartView(cartId: string, _opts?: { apiVersion: 2 }) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    orderBy: { id: "asc" },
                    include: {
                        product: {
                            select: {
                                id: true,
                                slug: true,
                                name: true,
                                description: true,
                                imageUrl: true,
                                priceCents: true,
                                currency: true,
                                isActive: true
                            }
                        }
                    }
                }
            }
        });

        if (!cart) throw new NotFoundException("CART_NOT_FOUND");

        // Hide inactive products from B2C cart view (optional policy)
        const items = cart.items.filter((i) => i.product.isActive);

        const totalCents = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);
        const currency = items[0]?.product.currency ?? "SEK";

        return {
            id: cart.id,
            items: items.map((i) => ({
                id: i.id,
                quantity: i.quantity,
                product: {
                    id: i.product.id,
                    slug: i.product.slug,
                    name: i.product.name,
                    description: i.product.description,
                    imageUrl: i.product.imageUrl,
                    priceCents: i.product.priceCents,
                    currency: i.product.currency
                },
                lineTotalCents: i.product.priceCents * i.quantity
            })),
            totals: { totalCents, currency }
        };
    }

    async addItem(cartId: string, input: CartAddItemDto, _opts?: { apiVersion: 2 }) {
        const product = await this.prisma.product.findUnique({
            where: { id: input.productId },
            select: { id: true, isActive: true }
        });

        if (!product) throw new BadRequestException("PRODUCT_NOT_FOUND");
        if (!product.isActive) throw new BadRequestException("PRODUCT_INACTIVE");

        // upsert by unique(cartId, productId)
        await this.prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId,
                    productId: input.productId
                }
            },
            update: {
                quantity: { increment: input.quantity }
            },
            create: {
                cartId,
                productId: input.productId,
                quantity: input.quantity
            }
        });

        return this.getCartView(cartId);
    }

    async updateItem(
        cartId: string,
        { itemId, quantity }: { itemId: string; quantity: number },
        _opts?: { apiVersion: 2 }
    ) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            select: { id: true, cartId: true }
        });

        if (!item || item.cartId !== cartId) throw new NotFoundException("CART_ITEM_NOT_FOUND");

        if (quantity === 0) {
            await this.prisma.cartItem.delete({ where: { id: itemId } });
            return this.getCartView(cartId);
        }

        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });

        return this.getCartView(cartId);
    }

    async removeItem(cartId: string, itemId: string, _opts?: { apiVersion: 2 }) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            select: { id: true, cartId: true }
        });

        if (!item || item.cartId !== cartId) throw new NotFoundException("CART_ITEM_NOT_FOUND");

        await this.prisma.cartItem.delete({ where: { id: itemId } });
        return this.getCartView(cartId);
    }
}
