import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";

export function imageFileFilter(_req: any, file: Express.Multer.File, cb: Function) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new BadRequestException("Only jpg, png, webp are allowed"), false);
    }
    cb(null, true);
}

export function productImageStorage() {
    return diskStorage({
        destination: (req, _file, cb) => {
            cb(null, `${process.env.UPLOAD_DIR ?? "uploads"}/products`);
        },
        filename: (req, file, cb) => {
            const productId = req.params.id;
            const safeExt = extname(file.originalname).toLowerCase() || ".jpg";
            const stamp = Date.now();
            cb(null, `${productId}-${stamp}${safeExt}`);
        }
    });
}
