import { mkdirSync, existsSync } from "fs";
import { join } from "path";

export function ensureUploadDirs() {
    const root = process.env.UPLOAD_DIR ?? "uploads";
    const products = join(process.cwd(), root, "products");

    if (!existsSync(products)) {
        mkdirSync(products, { recursive: true });
    }
}
