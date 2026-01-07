import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { PrismaService } from "../../../prisma/prisma.service";
import { AdminAuthResponseDto } from "./dto/admin-auth.response.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminAuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async login(dto: AdminLoginDto): Promise<AdminAuthResponseDto> {
        const user = await this.prisma.adminUser.findUnique({
            where: { email: dto.email }
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const passwordOk = await bcrypt.compare(dto.password, user.password);
        if (!passwordOk) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = {
            sub: user.id,
            role: user.role
        };

        return {
            accessToken: this.jwt.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}
