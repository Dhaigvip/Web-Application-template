import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class ActiveAdminGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        const admin = await this.prisma.adminUser.findUnique({
            where: { id: user.id }
        });

        if (!admin || !admin.isActive) {
            throw new ForbiddenException();
        }

        return true;
    }
}
