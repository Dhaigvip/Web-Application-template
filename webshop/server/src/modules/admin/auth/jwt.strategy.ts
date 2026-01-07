import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AdminRole } from "@prisma/client";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ADMIN_JWT_SECRET || ''
        });
    }

    validate(payload: { sub: string; role: AdminRole }) {
        return {
            id: payload.sub,
            role: payload.role
        };
    }
}
