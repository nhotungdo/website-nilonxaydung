/**
 * Shared IPC channel identifiers for Main <-> Renderer communications.
 */
export const IPC_CHANNELS = {
    // Printer Operations
    PRINTER: {
        GET_LIST: 'printer:get-list',
        GET_STATUS: 'printer:get-status',
        ADD: 'printer:add',
        UPDATE: 'printer:update',
        DELETE: 'printer:delete',
        SET_DEFAULT: 'printer:set-default',
        TEST: 'printer:test',
    },
    // Print Job Operations
    JOB: {
        GET_ACTIVE: 'job:get-active',
        GET_HISTORY: 'job:get-history',
        REPRINT: 'job:reprint',
        CANCEL: 'job:cancel',
        CLEAR_HISTORY: 'job:clear-history',
        ON_UPDATE: 'job:on-update', // Event emitted from main to renderer
    },
    // Settings & Authentication
    SETTINGS: {
        GET: 'settings:get',
        UPDATE: 'settings:update',
        SET_STARTUP: 'settings:set-startup',
    },
    // Socket.IO Status
    SOCKET: {
        GET_STATUS: 'socket:get-status',
        ON_STATUS_CHANGE: 'socket:on-status-change', // Event emitted from main to renderer
        ON_NEW_ORDER: 'socket:on-new-order', // Event emitted from main to renderer
    },
    // System Logs & Diagnostics
    SYSTEM: {
        GET_LOGS: 'system:get-logs',
        CLEAR_LOGS: 'system:clear-logs',
        ON_LOG_ADD: 'system:on-log-add',
    }
};
export default IPC_CHANNELS;
