import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AdminAuthController } from "./admin-auth.controller";
import { AdminAuthService } from "./admin-auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "../../../prisma/prisma.service";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.ADMIN_JWT_SECRET,
            signOptions: { expiresIn: process.env.NODE_ENV === 'production' ? '15m' : '7d' }
        })
    ],
    controllers: [AdminAuthController],
    providers: [AdminAuthService, JwtStrategy, PrismaService],
    exports: [JwtModule, PassportModule] // 👈 important
})
export class AdminAuthModule {}
