export var ConnectionType;
(function (ConnectionType) {
    ConnectionType["USB"] = "USB";
    ConnectionType["LAN"] = "LAN";
    ConnectionType["WIFI"] = "WIFI";
})(ConnectionType || (ConnectionType = {}));
export var PaperSize;
(function (PaperSize) {
    PaperSize["K58"] = "K58";
    PaperSize["K80"] = "K80";
})(PaperSize || (PaperSize = {}));
export var PrintJobStatus;
(function (PrintJobStatus) {
    PrintJobStatus["WAITING"] = "WAITING";
    PrintJobStatus["PRINTING"] = "PRINTING";
    PrintJobStatus["COMPLETED"] = "COMPLETED";
    PrintJobStatus["FAILED"] = "FAILED";
})(PrintJobStatus || (PrintJobStatus = {}));
export var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
