import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CartController } from "./cart.controller.v2";
import { CartService } from "./cart.service";

@Module({
    controllers: [CartController],
    providers: [PrismaService, CartService],
    exports: [CartService]
})
export class CartModule {}
