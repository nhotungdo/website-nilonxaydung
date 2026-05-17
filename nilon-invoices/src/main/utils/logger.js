import fs from 'fs';
import path from 'path';
import { app } from 'electron';
class Logger {
    logFilePath;
    constructor() {
        let storageDir = '';
        const isDev = process.env.NODE_ENV !== 'production';
        try {
            if (isDev) {
                storageDir = path.resolve(__dirname, '../../../storage');
            }
            else {
                storageDir = path.join(app.getPath('userData'), 'storage');
            }
        }
        catch {
            // Fallback if app path is not initialized yet (early boots)
            storageDir = path.join(process.cwd(), 'storage');
        }
        const logDir = path.join(storageDir, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        this.logFilePath = path.join(logDir, 'nilon.log');
    }
    writeToFile(level, message) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;
        try {
            fs.appendFileSync(this.logFilePath, formattedMessage, 'utf8');
        }
        catch (err) {
            console.error('[Logger Error] Failed to write to log file:', err);
        }
    }
    info(message) {
        const formatted = `[INFO] ${message}`;
        console.log(`\x1b[32m${formatted}\x1b[0m`); // Green color console
        this.writeToFile('INFO', message);
    }
    warn(message) {
        const formatted = `[WARN] ${message}`;
        console.warn(`\x1b[33m${formatted}\x1b[0m`); // Yellow color console
        this.writeToFile('WARN', message);
    }
    error(message, stack) {
        const formatted = `[ERROR] ${message}${stack ? `\nStack: ${stack}` : ''}`;
        console.error(`\x1b[31m${formatted}\x1b[0m`); // Red color console
        this.writeToFile('ERROR', `${message}${stack ? ` | Stack: ${stack}` : ''}`);
    }
    query(sql, durationMs) {
        const durationInfo = durationMs !== undefined ? ` | took ${durationMs}ms` : '';
        const message = `SQL Query: ${sql}${durationInfo}`;
        console.log(`\x1b[36m[DB-QUERY] ${message}\x1b[0m`); // Cyan color console
        this.writeToFile('QUERY', message);
    }
    ipc(channel, payload) {
        const cleanPayload = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
        const message = `IPC Event [${channel}] payload: ${cleanPayload}`;
        console.log(`\x1b[34m[IPC] ${message}\x1b[0m`); // Blue color console
        this.writeToFile('IPC', message);
    }
}
export const logger = new Logger();
