import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { ENV_B2B_API_KEY, VISIBILITY_HEADER_API_KEY } from "./visibility.constants";
import { VisibilityContext } from "./visibility.types";

export type VisibilityRequest = Request & { 
    visibility?: VisibilityContext;
    version?: string;
};

@Injectable()
export class VisibilityGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<VisibilityRequest>();

        const configuredB2bKey = process.env[ENV_B2B_API_KEY];
        const providedKeyRaw = req.headers[VISIBILITY_HEADER_API_KEY] ?? req.headers[VISIBILITY_HEADER_API_KEY.toLowerCase()];
        const providedKey = Array.isArray(providedKeyRaw) ? providedKeyRaw[0] : providedKeyRaw;

        const isB2b =
            typeof configuredB2bKey === "string" &&
            configuredB2bKey.length > 0 &&
            typeof providedKey === "string" &&
            providedKey === configuredB2bKey;

        req.visibility = {
            channel: isB2b ? "b2b" : "b2c",
            includeInactive: isB2b
        };

        return true; // always allow; guard only annotates visibility
    }
}
