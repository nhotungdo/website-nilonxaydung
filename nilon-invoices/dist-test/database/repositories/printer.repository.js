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
exports.PrinterRepository = void 0;
var postgres_1 = require("../postgres");
var PrinterRepository = /** @class */ (function () {
    function PrinterRepository() {
    }
    PrinterRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = 'SELECT * FROM printers ORDER BY is_default DESC, name ASC;';
                        return [4 /*yield*/, postgres_1.db.executeQuery(sql)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows];
                }
            });
        });
    };
    PrinterRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = 'SELECT * FROM printers WHERE id = $1;';
                        return [4 /*yield*/, postgres_1.db.executeQuery(sql, [id])];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows[0] || null];
                }
            });
        });
    };
    PrinterRepository.prototype.create = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n      INSERT INTO printers (id, name, paper_size, connection_type, ip_address, is_default, is_active)\n      VALUES ($1, $2, $3, $4, $5, $6, $7)\n      RETURNING *;\n    ";
                        return [4 /*yield*/, postgres_1.db.executeQuery(sql, [
                                dto.id,
                                dto.name,
                                dto.paper_size,
                                dto.connection_type,
                                dto.ip_address,
                                dto.is_default,
                                dto.is_active
                            ])];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows[0]];
                }
            });
        });
    };
    PrinterRepository.prototype.update = function (id, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, values, paramIndex, sql, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = [];
                        values = [];
                        paramIndex = 1;
                        Object.entries(dto).forEach(function (_a) {
                            var key = _a[0], val = _a[1];
                            fields.push("".concat(key, " = $").concat(paramIndex));
                            values.push(val);
                            paramIndex++;
                        });
                        if (fields.length === 0) {
                            return [2 /*return*/, this.findById(id)];
                        }
                        values.push(id);
                        sql = "\n      UPDATE printers\n      SET ".concat(fields.join(', '), "\n      WHERE id = $").concat(paramIndex, "\n      RETURNING *;\n    ");
                        return [4 /*yield*/, postgres_1.db.executeQuery(sql, values)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows[0] || null];
                }
            });
        });
    };
    PrinterRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = 'DELETE FROM printers WHERE id = $1;';
                        return [4 /*yield*/, postgres_1.db.executeQuery(sql, [id])];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rowCount !== null && res.rowCount > 0];
                }
            });
        });
    };
    PrinterRepository.prototype.unsetDefaults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = 'UPDATE printers SET is_default = FALSE;';
                        return [4 /*yield*/, postgres_1.db.executeQuery(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PrinterRepository;
}());
exports.PrinterRepository = PrinterRepository;
