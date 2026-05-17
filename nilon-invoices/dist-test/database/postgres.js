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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.PostgresDatabase = void 0;
var pg_1 = __importDefault(require("pg"));
var Pool = pg_1.default.Pool;
var config_1 = require("../utils/config");
var logger_1 = require("../utils/logger");
var PostgresDatabase = /** @class */ (function () {
    function PostgresDatabase() {
        this.pool = null;
        this.isConnecting = false;
    }
    PostgresDatabase.getInstance = function () {
        if (!PostgresDatabase.instance) {
            PostgresDatabase.instance = new PostgresDatabase();
        }
        return PostgresDatabase.instance;
    };
    /**
     * Initializes and connects to the PostgreSQL Pool
     */
    PostgresDatabase.prototype.connectDatabase = function () {
        return __awaiter(this, arguments, void 0, function (retries, delayMs) {
            var _loop_1, this_1, attempt, state_1;
            var _this = this;
            if (retries === void 0) { retries = 5; }
            if (delayMs === void 0) { delayMs = 1000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.pool)
                            return [2 /*return*/];
                        if (this.isConnecting)
                            return [2 /*return*/];
                        this.isConnecting = true;
                        logger_1.logger.info("[Postgres] Connecting to database at ".concat(config_1.config.db.host, ":").concat(config_1.config.db.port, "/").concat(config_1.config.db.name, "..."));
                        _loop_1 = function (attempt) {
                            var client, err_1, _b, backoffDelay_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 9]);
                                        this_1.pool = new Pool({
                                            connectionString: config_1.config.db.url,
                                            max: 20,
                                            idleTimeoutMillis: 30000,
                                            connectionTimeoutMillis: 5000
                                        });
                                        return [4 /*yield*/, this_1.pool.connect()];
                                    case 1:
                                        client = _c.sent();
                                        client.release();
                                        logger_1.logger.info("[Postgres] Database connected successfully on attempt ".concat(attempt, "."));
                                        this_1.isConnecting = false;
                                        // Register pool error events
                                        this_1.pool.on('error', function (err) {
                                            logger_1.logger.error("[Postgres] Unexpected pool error: ".concat(err.message), err.stack);
                                            _this.handleDisconnect();
                                        });
                                        return [2 /*return*/, { value: void 0 }];
                                    case 2:
                                        err_1 = _c.sent();
                                        logger_1.logger.error("[Postgres] Connection attempt ".concat(attempt, " failed: ").concat(err_1.message));
                                        if (!this_1.pool) return [3 /*break*/, 7];
                                        _c.label = 3;
                                    case 3:
                                        _c.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, this_1.pool.end()];
                                    case 4:
                                        _c.sent();
                                        return [3 /*break*/, 6];
                                    case 5:
                                        _b = _c.sent();
                                        return [3 /*break*/, 6];
                                    case 6:
                                        this_1.pool = null;
                                        _c.label = 7;
                                    case 7:
                                        if (attempt === retries) {
                                            this_1.isConnecting = false;
                                            throw new Error("[Postgres] Max connection retries reached. Could not connect to database: ".concat(err_1.message));
                                        }
                                        backoffDelay_1 = delayMs * Math.pow(2, attempt - 1);
                                        logger_1.logger.warn("[Postgres] Retrying connection in ".concat(backoffDelay_1, "ms..."));
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, backoffDelay_1); })];
                                    case 8:
                                        _c.sent();
                                        return [3 /*break*/, 9];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        attempt = 1;
                        _a.label = 1;
                    case 1:
                        if (!(attempt <= retries)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(attempt)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle unexpected pool disconnections
     */
    PostgresDatabase.prototype.handleDisconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.pool = null;
                        logger_1.logger.warn('[Postgres] Connection lost. Re-initiating auto reconnect...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connectDatabase()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        logger_1.logger.error("[Postgres] Auto-reconnect failed: ".concat(err_2.message));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Closes the database pool
     */
    PostgresDatabase.prototype.closeDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pool)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.pool.end()];
                    case 2:
                        _a.sent();
                        this.pool = null;
                        logger_1.logger.info('[Postgres] Database connection pool closed.');
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        logger_1.logger.error("[Postgres] Failed to close database: ".concat(err_3.message), err_3.stack);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Test current connection status
     */
    PostgresDatabase.prototype.testDatabaseConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, res, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.pool)
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.pool.connect()];
                    case 2:
                        client = _a.sent();
                        return [4 /*yield*/, client.query('SELECT NOW()')];
                    case 3:
                        res = _a.sent();
                        client.release();
                        return [2 /*return*/, res.rowCount !== null && res.rowCount > 0];
                    case 4:
                        err_4 = _a.sent();
                        logger_1.logger.error("[Postgres] Connection health check failed: ".concat(err_4.message));
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Execute query with runtime metrics logging
     */
    PostgresDatabase.prototype.executeQuery = function (sql_1) {
        return __awaiter(this, arguments, void 0, function (sql, params) {
            var startTime, result, duration, err_5;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.pool) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connectDatabase()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.pool) {
                            throw new Error('[Postgres] Database pool not initialized.');
                        }
                        startTime = Date.now();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.pool.query(sql, params)];
                    case 4:
                        result = _a.sent();
                        duration = Date.now() - startTime;
                        logger_1.logger.query(sql, duration);
                        return [2 /*return*/, result];
                    case 5:
                        err_5 = _a.sent();
                        logger_1.logger.error("[Postgres] Query failed: \"".concat(sql, "\" | Error: ").concat(err_5.message), err_5.stack);
                        throw err_5;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Safe transaction wrapper with client lifecycle checks
     */
    PostgresDatabase.prototype.transaction = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var client, result, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.pool) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connectDatabase()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.pool) {
                            throw new Error('[Postgres] Database pool not initialized.');
                        }
                        return [4 /*yield*/, this.pool.connect()];
                    case 3:
                        client = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 8, 10, 11]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 5:
                        _a.sent();
                        logger_1.logger.query('BEGIN TRANSACTION');
                        return [4 /*yield*/, callback(client)];
                    case 6:
                        result = _a.sent();
                        return [4 /*yield*/, client.query('COMMIT')];
                    case 7:
                        _a.sent();
                        logger_1.logger.query('COMMIT TRANSACTION');
                        return [2 /*return*/, result];
                    case 8:
                        err_6 = _a.sent();
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 9:
                        _a.sent();
                        logger_1.logger.warn('[Postgres] Transaction rolled back due to error.');
                        logger_1.logger.error("[Postgres] Transaction failure: ".concat(err_6.message), err_6.stack);
                        throw err_6;
                    case 10:
                        client.release();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    PostgresDatabase.instance = null;
    return PostgresDatabase;
}());
exports.PostgresDatabase = PostgresDatabase;
exports.db = PostgresDatabase.getInstance();
