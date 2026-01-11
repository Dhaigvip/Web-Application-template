import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path/win32";
import { ensureUploadDirs } from "./common/uploads/uploads.init";
import { VersionInterceptor } from "./common/interceptors/version.interceptor";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

function getCorsOrigins(): string[] | boolean {
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
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use("/v2/api/payments/stripe/webhook", bodyParser.raw({ type: "*/*" }));

    app.use(bodyParser.json());

    // ✅ Increase body size limits (for file uploads, large payloads)
    app.use(require("express").json({ limit: "50mb" }));
    app.use(require("express").urlencoded({ limit: "50mb", extended: true }));

    // ✅ API versioning (/v1, /v2)
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1"
    });

    app.use(cookieParser());

    // ✅ Extract version from URL and add to request
    app.useGlobalInterceptors(new VersionInterceptor());

    ensureUploadDirs();

    // ✅ serve uploaded files
    const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
    app.useStaticAssets(join(process.cwd(), uploadDir), { prefix: "/uploads" });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: false
        })
    );

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
