import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdminRole } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles =
            this.reflector.get<string[]>("roles", context.getHandler()) ??
            this.reflector.get<string[]>("roles", context.getClass());

        const { user } = context.switchToHttp().getRequest();

        // 🔑 SUPER_ADMIN bypass
        if (user?.role === "SUPER_ADMIN") {
            return true;
        }

        // No role metadata → allow
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        return requiredRoles.includes(user.role);
    }
}
