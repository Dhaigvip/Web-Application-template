"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
function getCorsOrigins() {
    const raw = process.env.CORS_ORIGINS;
    // If not set, allow all (useful for local dev / internal APIs)
    if (!raw) {
        return true;
    }
    const origins = raw
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
    return origins.length > 0 ? origins : true;
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const raw = process.env.CORS_ORIGINS;
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true, // strings → numbers
        whitelist: true, // strip unknown fields
        forbidNonWhitelisted: false
    }));
    app.enableCors({
        origin: getCorsOrigins(),
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
        credentials: false
    });
    const port = process.env.API_PORT || 4200;
    await app.listen(port, "0.0.0.0");
}
bootstrap();
