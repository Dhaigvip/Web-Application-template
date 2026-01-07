"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibilityGuard = void 0;
const common_1 = require("@nestjs/common");
const visibility_constants_1 = require("./visibility.constants");
let VisibilityGuard = class VisibilityGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const configuredB2bKey = process.env[visibility_constants_1.ENV_B2B_API_KEY];
        const providedKeyRaw = req.headers[visibility_constants_1.VISIBILITY_HEADER_API_KEY] ?? req.headers[visibility_constants_1.VISIBILITY_HEADER_API_KEY.toLowerCase()];
        const providedKey = Array.isArray(providedKeyRaw) ? providedKeyRaw[0] : providedKeyRaw;
        const isB2b = typeof configuredB2bKey === "string" &&
            configuredB2bKey.length > 0 &&
            typeof providedKey === "string" &&
            providedKey === configuredB2bKey;
        req.visibility = {
            channel: isB2b ? "b2b" : "b2c",
            includeInactive: isB2b
        };
        return true; // always allow; guard only annotates visibility
    }
};
exports.VisibilityGuard = VisibilityGuard;
exports.VisibilityGuard = VisibilityGuard = __decorate([
    (0, common_1.Injectable)()
], VisibilityGuard);
