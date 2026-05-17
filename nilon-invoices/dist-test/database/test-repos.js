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
exports.runDiagnostics = void 0;
var postgres_1 = require("./postgres");
var logger_1 = require("../utils/logger");
var printer_repository_1 = require("./repositories/printer.repository");
var order_repository_1 = require("./repositories/order.repository");
var print_job_repository_1 = require("./repositories/print-job.repository");
var failed_job_repository_1 = require("./repositories/failed-job.repository");
var runDiagnostics = function () { return __awaiter(void 0, void 0, void 0, function () {
    var printerRepo, orderRepo, jobRepo, failRepo, printers, orders, totalSales_1, sample, jobs, pendingJobs, completedJobs, failedJobsCount, failures, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.logger.info('============================================================');
                logger_1.logger.info('[Diagnostic] STARTING NILON INVOICES REPOSITORY DIAGNOSTICS');
                logger_1.logger.info('============================================================');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, 8, 10]);
                // 1. Establish pooled connection
                return [4 /*yield*/, postgres_1.db.connectDatabase()];
            case 2:
                // 1. Establish pooled connection
                _a.sent();
                printerRepo = new printer_repository_1.PrinterRepository();
                orderRepo = new order_repository_1.OrderRepository();
                jobRepo = new print_job_repository_1.PrintJobRepository();
                failRepo = new failed_job_repository_1.FailedJobRepository();
                // 2. Test Printers Repository
                logger_1.logger.info('\n--- [1] Printers Diagnostics ---');
                return [4 /*yield*/, printerRepo.findAll()];
            case 3:
                printers = _a.sent();
                logger_1.logger.info("Found ".concat(printers.length, " registered printers in database:"));
                printers.forEach(function (p) {
                    logger_1.logger.info("  \u2022 ID: ".concat(p.id, " | Name: \"").concat(p.name, "\" | Paper: ").concat(p.paper_size, " | Connection: ").concat(p.connection_type, " | Default: ").concat(p.is_default, " | Active: ").concat(p.is_active));
                });
                // 3. Test Orders Repository
                logger_1.logger.info('\n--- [2] Orders Diagnostics ---');
                return [4 /*yield*/, orderRepo.findAll()];
            case 4:
                orders = _a.sent();
                logger_1.logger.info("Found ".concat(orders.length, " orders in database."));
                totalSales_1 = 0;
                orders.forEach(function (o) {
                    totalSales_1 += Number(o.total_amount);
                });
                logger_1.logger.info("Total aggregated sales order value: ".concat(totalSales_1.toLocaleString('vi-VN'), " VND"));
                if (orders.length > 0) {
                    sample = orders[0];
                    logger_1.logger.info("Sample Order: ".concat(sample.id, " (").concat(sample.order_code, ") - Customer: \"").concat(sample.customer_name, "\" - Phone: ").concat(sample.customer_phone));
                }
                // 4. Test Print Jobs Repository
                logger_1.logger.info('\n--- [3] Print Jobs Diagnostics ---');
                return [4 /*yield*/, jobRepo.findAll()];
            case 5:
                jobs = _a.sent();
                logger_1.logger.info("Found ".concat(jobs.length, " total print spooler jobs."));
                pendingJobs = jobs.filter(function (j) { return j.status === 'WAITING' || j.status === 'PRINTING'; });
                completedJobs = jobs.filter(function (j) { return j.status === 'COMPLETED'; });
                failedJobsCount = jobs.filter(function (j) { return j.status === 'FAILED'; });
                logger_1.logger.info("  \u2022 Spool Stats: WAITING/PRINTING: ".concat(pendingJobs.length, " | COMPLETED: ").concat(completedJobs.length, " | FAILED: ").concat(failedJobsCount.length));
                // 5. Test Failed Jobs Repository
                logger_1.logger.info('\n--- [4] Troubleshooting Failures Diagnostics ---');
                return [4 /*yield*/, failRepo.findAll()];
            case 6:
                failures = _a.sent();
                logger_1.logger.info("Found ".concat(failures.length, " active failed print spools:"));
                failures.forEach(function (f) {
                    logger_1.logger.info("  \u2022 Failure ID: ".concat(f.id, " | Print Job ID: ").concat(f.print_job_id, " | Code: ").concat(f.error_code, " | Msg: \"").concat(f.error_message, "\""));
                });
                logger_1.logger.info('\n============================================================');
                logger_1.logger.info('[Diagnostic] ALL DATABASE REPOSITORIES TESTED SUCCESSFULLY! ✅');
                logger_1.logger.info('============================================================');
                return [3 /*break*/, 10];
            case 7:
                err_1 = _a.sent();
                logger_1.logger.error("\n[Diagnostic] Diagnostic validation failed: ".concat(err_1.message), err_1.stack);
                throw err_1;
            case 8: return [4 /*yield*/, postgres_1.db.closeDatabase()];
            case 9:
                _a.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.runDiagnostics = runDiagnostics;
// Execute if run directly
if (require.main === module) {
    (0, exports.runDiagnostics)()
        .then(function () {
        logger_1.logger.info('[Diagnostic] Diagnostic CLI execution completed.');
        process.exit(0);
    })
        .catch(function (err) {
        logger_1.logger.error('[Diagnostic] Diagnostic CLI failed.', err.stack);
        process.exit(1);
    });
}
