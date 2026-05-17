"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var electron_1 = require("electron");
var Logger = /** @class */ (function () {
    function Logger() {
        var storageDir = '';
        var isDev = process.env.NODE_ENV !== 'production';
        try {
            if (isDev) {
                storageDir = path_1.default.resolve(__dirname, '../../../storage');
            }
            else {
                storageDir = path_1.default.join(electron_1.app.getPath('userData'), 'storage');
            }
        }
        catch (_a) {
            // Fallback if app path is not initialized yet (early boots)
            storageDir = path_1.default.join(process.cwd(), 'storage');
        }
        var logDir = path_1.default.join(storageDir, 'logs');
        if (!fs_1.default.existsSync(logDir)) {
            fs_1.default.mkdirSync(logDir, { recursive: true });
        }
        this.logFilePath = path_1.default.join(logDir, 'nilon.log');
    }
    Logger.prototype.writeToFile = function (level, message) {
        var timestamp = new Date().toISOString();
        var formattedMessage = "[".concat(timestamp, "] [").concat(level, "] ").concat(message, "\n");
        try {
            fs_1.default.appendFileSync(this.logFilePath, formattedMessage, 'utf8');
        }
        catch (err) {
            console.error('[Logger Error] Failed to write to log file:', err);
        }
    };
    Logger.prototype.info = function (message) {
        var formatted = "[INFO] ".concat(message);
        console.log("\u001B[32m".concat(formatted, "\u001B[0m")); // Green color console
        this.writeToFile('INFO', message);
    };
    Logger.prototype.warn = function (message) {
        var formatted = "[WARN] ".concat(message);
        console.warn("\u001B[33m".concat(formatted, "\u001B[0m")); // Yellow color console
        this.writeToFile('WARN', message);
    };
    Logger.prototype.error = function (message, stack) {
        var formatted = "[ERROR] ".concat(message).concat(stack ? "\nStack: ".concat(stack) : '');
        console.error("\u001B[31m".concat(formatted, "\u001B[0m")); // Red color console
        this.writeToFile('ERROR', "".concat(message).concat(stack ? " | Stack: ".concat(stack) : ''));
    };
    Logger.prototype.query = function (sql, durationMs) {
        var durationInfo = durationMs !== undefined ? " | took ".concat(durationMs, "ms") : '';
        var message = "SQL Query: ".concat(sql).concat(durationInfo);
        console.log("\u001B[36m[DB-QUERY] ".concat(message, "\u001B[0m")); // Cyan color console
        this.writeToFile('QUERY', message);
    };
    Logger.prototype.ipc = function (channel, payload) {
        var cleanPayload = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
        var message = "IPC Event [".concat(channel, "] payload: ").concat(cleanPayload);
        console.log("\u001B[34m[IPC] ".concat(message, "\u001B[0m")); // Blue color console
        this.writeToFile('IPC', message);
    };
    return Logger;
}());
exports.logger = new Logger();
