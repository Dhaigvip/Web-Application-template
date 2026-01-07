"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_B2B_API_KEY = exports.VISIBILITY_HEADER_API_KEY = void 0;
exports.VISIBILITY_HEADER_API_KEY = "x-api-key";
// If the key matches env.B2B_API_KEY, treat request as B2B.
// Otherwise B2C.
exports.ENV_B2B_API_KEY = "B2B_API_KEY";
