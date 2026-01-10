"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFileFilter = imageFileFilter;
exports.productImageStorage = productImageStorage;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
function imageFileFilter(_req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new common_1.BadRequestException("Only jpg, png, webp are allowed"), false);
    }
    cb(null, true);
}
function productImageStorage() {
    return (0, multer_1.diskStorage)({
        destination: (req, _file, cb) => {
            cb(null, `${process.env.UPLOAD_DIR ?? "uploads"}/products`);
        },
        filename: (req, file, cb) => {
            const productId = req.params.id;
            const safeExt = (0, path_1.extname)(file.originalname).toLowerCase() || ".jpg";
            const stamp = Date.now();
            cb(null, `${productId}-${stamp}${safeExt}`);
        }
    });
}
