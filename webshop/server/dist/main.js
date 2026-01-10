"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const win32_1 = require("path/win32");
const uploads_init_1 = require("./common/uploads/uploads.init");
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
    // ✅ API versioning (/v1, /v2)
    app.enableVersioning({
        type: common_2.VersioningType.URI,
        defaultVersion: "1"
    });
    (0, uploads_init_1.ensureUploadDirs)();
    // ✅ serve uploaded files
    const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
    app.useStaticAssets((0, win32_1.join)(process.cwd(), uploadDir), { prefix: "/uploads" });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
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
