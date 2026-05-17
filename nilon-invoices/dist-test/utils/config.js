"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertConfigIsValid = exports.config = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var logger_1 = require("./logger");
// Explicitly load .env file from project root
var envPath = path_1.default.resolve(process.cwd(), '.env');
if (fs_1.default.existsSync(envPath)) {
    dotenv_1.default.config({ path: envPath });
    logger_1.logger.info("Loaded environment configuration from: ".concat(envPath));
}
else {
    dotenv_1.default.config();
    logger_1.logger.warn("No .env file found at ".concat(envPath, ", falling back to system environment variables."));
}
exports.config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'nilon-invoices',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123456',
        url: process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/nilon-invoices'
    },
    isDev: process.env.NODE_ENV !== 'production'
};
// Strict check assertions
var assertConfigIsValid = function () {
    var missing = [];
    if (!exports.config.db.host)
        missing.push('DB_HOST');
    if (!exports.config.db.name)
        missing.push('DB_NAME');
    if (!exports.config.db.user)
        missing.push('DB_USER');
    if (missing.length > 0) {
        throw new Error("CRITICAL CONFIG FAILURE: Missing environment variables: ".concat(missing.join(', ')));
    }
};
exports.assertConfigIsValid = assertConfigIsValid;
