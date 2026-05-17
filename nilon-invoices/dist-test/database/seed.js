"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeds = void 0;
var postgres_1 = require("./postgres");
var logger_1 = require("../utils/logger");
var types_1 = require("./types");
var runSeeds = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.logger.info('[Seeder] Seeding PostgreSQL database with mock data...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, postgres_1.db.connectDatabase()];
            case 2:
                _a.sent();
                return [4 /*yield*/, postgres_1.db.transaction(function (client) { return __awaiter(void 0, void 0, void 0, function () {
                        var printersList, _i, printersList_1, prn, customerNames, customerPhones, paymentMethods, i, orderId, orderCode, nameIdx, phoneIdx, payIdx, totalAmount, status_1, pdfPath, spoolStatuses, i, jobId, orderId, printerId, pdfPath, status_2, retryCount, errorMsg, printedAt, i, failedId, printJobId, errCodes, errMsgs, stackTrace;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    // 1. Seed App Settings (id = 1)
                                    logger_1.logger.info('[Seeder] Seeding system configurations app_settings...');
                                    return [4 /*yield*/, client.query("\n        INSERT INTO app_settings (id, api_url, socket_url, api_token, auto_startup, notification_sound, dark_mode)\n        VALUES ($1, $2, $3, $4, $5, $6, $7)\n        ON CONFLICT (id) DO UPDATE SET\n          api_url = EXCLUDED.api_url,\n          socket_url = EXCLUDED.socket_url,\n          api_token = EXCLUDED.api_token,\n          auto_startup = EXCLUDED.auto_startup,\n          notification_sound = EXCLUDED.notification_sound,\n          dark_mode = EXCLUDED.dark_mode;\n      ", [
                                            1,
                                            'http://localhost:3000',
                                            'http://localhost:3000',
                                            'nilon_sec_auth_key_2026',
                                            false,
                                            true,
                                            true
                                        ])];
                                case 1:
                                    _a.sent();
                                    // 2. Seed Printers (5 Printers)
                                    logger_1.logger.info('[Seeder] Seeding printers registry...');
                                    printersList = [
                                        ['PRN-01', 'Thermal Cashier K80-A', types_1.PaperSize.K80, types_1.ConnectionType.USB, null, true, true],
                                        ['PRN-02', 'Thermal Helper K58', types_1.PaperSize.K58, types_1.ConnectionType.USB, null, false, true],
                                        ['PRN-03', 'Warehouse Delivery K80-B', types_1.PaperSize.K80, types_1.ConnectionType.LAN, '192.168.1.200', false, true],
                                        ['PRN-04', 'Administrative Invoice XP-80', types_1.PaperSize.K80, types_1.ConnectionType.LAN, '192.168.1.201', false, true],
                                        ['PRN-05', 'Auxiliary Backup XP-58', types_1.PaperSize.K58, types_1.ConnectionType.WIFI, '192.168.1.202', false, false]
                                    ];
                                    _i = 0, printersList_1 = printersList;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < printersList_1.length)) return [3 /*break*/, 5];
                                    prn = printersList_1[_i];
                                    return [4 /*yield*/, client.query("\n          INSERT INTO printers (id, name, paper_size, connection_type, ip_address, is_default, is_active)\n          VALUES ($1, $2, $3, $4, $5, $6, $7)\n          ON CONFLICT (id) DO NOTHING;\n        ", prn)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 5:
                                    // 3. Seed Orders (20 Orders)
                                    logger_1.logger.info('[Seeder] Seeding orders data...');
                                    customerNames = [
                                        'Nguyễn Thành Long (Đại lý Q.12)', 'Công ty XD An Phong', 'VLXD Tiến Phát',
                                        'Bùi Minh Trí (Thầu phụ)', 'Trần Thị Mai (Đại lý phân phối)', 'Lê Hoàng Hải',
                                        'Phạm Văn Cường', 'Vũ Thị Hồng', 'Đỗ Minh Tuấn', 'Nguyễn Thu Thảo',
                                        'Trần Đình Phong', 'Hoàng Gia Bảo', 'Lâm Khải Minh', 'Nguyễn Thị Kim Anh',
                                        'Võ Tiến Dũng', 'Phan Thanh Bình', 'Đặng Quốc Khánh', 'Lý Gia Hào',
                                        'Bùi Thế Anh', 'Nguyễn Gia Lạc'
                                    ];
                                    customerPhones = [
                                        '0908887766', '0912223344', '0933556677', '0978990011', '0944778899',
                                        '0965332211', '0922114477', '0901234567', '0987654321', '0909090909',
                                        '0911223344', '0955667788', '0933445566', '0907776655', '0914445556',
                                        '0985556667', '0973332221', '0902221113', '0961110002', '0941112223'
                                    ];
                                    paymentMethods = ['TRANSFER', 'CASH', 'TRANSFER', 'CASH', 'TRANSFER'];
                                    i = 1;
                                    _a.label = 6;
                                case 6:
                                    if (!(i <= 20)) return [3 /*break*/, 9];
                                    orderId = "ORD-2026-".concat(1000 + i);
                                    orderCode = "NLN-".concat(10000 + i * 423);
                                    nameIdx = (i - 1) % customerNames.length;
                                    phoneIdx = (i - 1) % customerPhones.length;
                                    payIdx = (i - 1) % paymentMethods.length;
                                    totalAmount = (5 + (i % 8)) * 500000;
                                    status_1 = i <= 10 ? 'COMPLETED' : i <= 15 ? 'FAILED' : 'PENDING';
                                    pdfPath = "https://api.nilonxaydung.vn/invoices/pdf/".concat(orderId);
                                    return [4 /*yield*/, client.query("\n          INSERT INTO orders (id, order_code, customer_name, customer_phone, total_amount, payment_method, status, invoice_pdf)\n          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\n          ON CONFLICT (id) DO NOTHING;\n        ", [
                                            orderId,
                                            orderCode,
                                            customerNames[nameIdx],
                                            customerPhones[phoneIdx],
                                            totalAmount,
                                            paymentMethods[payIdx],
                                            status_1,
                                            pdfPath
                                        ])];
                                case 7:
                                    _a.sent();
                                    _a.label = 8;
                                case 8:
                                    i++;
                                    return [3 /*break*/, 6];
                                case 9:
                                    // 4. Seed Print Jobs (10 Jobs)
                                    logger_1.logger.info('[Seeder] Seeding print spool queue print_jobs...');
                                    spoolStatuses = [
                                        types_1.PrintJobStatus.COMPLETED,
                                        types_1.PrintJobStatus.COMPLETED,
                                        types_1.PrintJobStatus.COMPLETED,
                                        types_1.PrintJobStatus.COMPLETED,
                                        types_1.PrintJobStatus.COMPLETED,
                                        types_1.PrintJobStatus.FAILED,
                                        types_1.PrintJobStatus.FAILED,
                                        types_1.PrintJobStatus.FAILED,
                                        types_1.PrintJobStatus.FAILED,
                                        types_1.PrintJobStatus.FAILED
                                    ];
                                    i = 1;
                                    _a.label = 10;
                                case 10:
                                    if (!(i <= 10)) return [3 /*break*/, 13];
                                    jobId = "JOB-2026-".concat(100 + i);
                                    orderId = "ORD-2026-".concat(1000 + i);
                                    printerId = i % 2 === 0 ? 'PRN-01' : 'PRN-03';
                                    pdfPath = "C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\NLN-".concat(10000 + i * 423, ".pdf");
                                    status_2 = spoolStatuses[i - 1];
                                    retryCount = status_2 === types_1.PrintJobStatus.FAILED ? 3 : 0;
                                    errorMsg = status_2 === types_1.PrintJobStatus.FAILED ? 'ERROR_PAPER_JAM: Spooler paper spindle locked.' : null;
                                    printedAt = status_2 === types_1.PrintJobStatus.COMPLETED ? new Date() : null;
                                    return [4 /*yield*/, client.query("\n          INSERT INTO print_jobs (id, order_id, printer_id, pdf_path, status, retry_count, error_message, printed_at)\n          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\n          ON CONFLICT (id) DO NOTHING;\n        ", [
                                            jobId,
                                            orderId,
                                            printerId,
                                            pdfPath,
                                            status_2,
                                            retryCount,
                                            errorMsg,
                                            printedAt
                                        ])];
                                case 11:
                                    _a.sent();
                                    _a.label = 12;
                                case 12:
                                    i++;
                                    return [3 /*break*/, 10];
                                case 13:
                                    // 5. Seed Failed Jobs (5 Failures)
                                    logger_1.logger.info('[Seeder] Seeding troubleshooting failures failed_jobs...');
                                    i = 1;
                                    _a.label = 14;
                                case 14:
                                    if (!(i <= 5)) return [3 /*break*/, 17];
                                    failedId = "FAIL-2026-".concat(10 + i);
                                    printJobId = "JOB-2026-".concat(100 + 5 + i);
                                    errCodes = ['ERR_PAPER_JAM', 'ERR_OFFLINE', 'ERR_OUT_OF_PAPER', 'ERR_TIMEOUT', 'ERR_SPOOL_FAIL'];
                                    errMsgs = [
                                        'Cutter blade jammed.',
                                        'Printer disconnected. Driver offline.',
                                        'Paper roll exhausted.',
                                        'Spooler socket connection timed out.',
                                        'Raw system printer spool buffer overflow.'
                                    ];
                                    stackTrace = 'at PrinterManager.printPDF (src/main/printer/printer.manager.ts:182:25)\nat QueueProcessor.processJob (src/main/printer/queue.processor.ts:94:12)';
                                    return [4 /*yield*/, client.query("\n          INSERT INTO failed_jobs (id, print_job_id, error_code, error_message, stack_trace, retry_attempts)\n          VALUES ($1, $2, $3, $4, $5, $6)\n          ON CONFLICT (id) DO NOTHING;\n        ", [
                                            failedId,
                                            printJobId,
                                            errCodes[i - 1],
                                            errMsgs[i - 1],
                                            stackTrace,
                                            3
                                        ])];
                                case 15:
                                    _a.sent();
                                    _a.label = 16;
                                case 16:
                                    i++;
                                    return [3 /*break*/, 14];
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                logger_1.logger.info('[Seeder] Database seeded successfully.');
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                logger_1.logger.error("[Seeder] Seeding failed: ".concat(err_1.message), err_1.stack);
                throw err_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.runSeeds = runSeeds;
// If executing directly from terminal (e.g. ts-node src/main/database/seed.ts)
if (require.main === module) {
    (0, exports.runSeeds)()
        .then(function () {
        logger_1.logger.info('[Seeder] Seeder CLI command finished.');
        process.exit(0);
    })
        .catch(function (err) {
        logger_1.logger.error('[Seeder] CLI Execution failed.', err.stack);
        process.exit(1);
    });
}
