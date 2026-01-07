import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

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
    const app = await NestFactory.create(AppModule);
    const raw = process.env.CORS_ORIGINS;

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // strings → numbers
            whitelist: true, // strip unknown fields
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
