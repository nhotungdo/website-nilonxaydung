"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = exports.PrintJobStatus = exports.PaperSize = exports.ConnectionType = void 0;
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["USB"] = "USB";
    ConnectionType["LAN"] = "LAN";
    ConnectionType["WIFI"] = "WIFI";
})(ConnectionType || (exports.ConnectionType = ConnectionType = {}));
var PaperSize;
(function (PaperSize) {
    PaperSize["K58"] = "K58";
    PaperSize["K80"] = "K80";
})(PaperSize || (exports.PaperSize = PaperSize = {}));
var PrintJobStatus;
(function (PrintJobStatus) {
    PrintJobStatus["WAITING"] = "WAITING";
    PrintJobStatus["PRINTING"] = "PRINTING";
    PrintJobStatus["COMPLETED"] = "COMPLETED";
    PrintJobStatus["FAILED"] = "FAILED";
})(PrintJobStatus || (exports.PrintJobStatus = PrintJobStatus = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
