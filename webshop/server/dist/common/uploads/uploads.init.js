"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUploadDirs = ensureUploadDirs;
const fs_1 = require("fs");
const path_1 = require("path");
function ensureUploadDirs() {
    const root = process.env.UPLOAD_DIR ?? "uploads";
    const products = (0, path_1.join)(process.cwd(), root, "products");
    if (!(0, fs_1.existsSync)(products)) {
        (0, fs_1.mkdirSync)(products, { recursive: true });
    }
}
