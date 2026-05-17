import { db } from './postgres';
import { logger } from '../utils/logger';
import { ConnectionType, PaperSize, PrintJobStatus } from './types';
export const runSeeds = async () => {
    logger.info('[Seeder] Seeding PostgreSQL database with mock data...');
    try {
        await db.connectDatabase();
        await db.transaction(async (client) => {
            // 1. Seed App Settings (id = 1)
            logger.info('[Seeder] Seeding system configurations app_settings...');
            await client.query(`
        INSERT INTO app_settings (id, api_url, socket_url, api_token, auto_startup, notification_sound, dark_mode)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          api_url = EXCLUDED.api_url,
          socket_url = EXCLUDED.socket_url,
          api_token = EXCLUDED.api_token,
          auto_startup = EXCLUDED.auto_startup,
          notification_sound = EXCLUDED.notification_sound,
          dark_mode = EXCLUDED.dark_mode;
      `, [
                1,
                'http://localhost:3000',
                'http://localhost:3000',
                'nilon_sec_auth_key_2026',
                false,
                true,
                true
            ]);
            // 2. Seed Printers (5 Printers)
            logger.info('[Seeder] Seeding printers registry...');
            const printersList = [
                ['PRN-01', 'Thermal Cashier K80-A', PaperSize.K80, ConnectionType.USB, null, true, true],
                ['PRN-02', 'Thermal Helper K58', PaperSize.K58, ConnectionType.USB, null, false, true],
                ['PRN-03', 'Warehouse Delivery K80-B', PaperSize.K80, ConnectionType.LAN, '192.168.1.200', false, true],
                ['PRN-04', 'Administrative Invoice XP-80', PaperSize.K80, ConnectionType.LAN, '192.168.1.201', false, true],
                ['PRN-05', 'Auxiliary Backup XP-58', PaperSize.K58, ConnectionType.WIFI, '192.168.1.202', false, false]
            ];
            for (const prn of printersList) {
                await client.query(`
          INSERT INTO printers (id, name, paper_size, connection_type, ip_address, is_default, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING;
        `, prn);
            }
            // 3. Seed Orders (20 Orders)
            logger.info('[Seeder] Seeding orders data...');
            const customerNames = [
                'Nguyễn Thành Long (Đại lý Q.12)', 'Công ty XD An Phong', 'VLXD Tiến Phát',
                'Bùi Minh Trí (Thầu phụ)', 'Trần Thị Mai (Đại lý phân phối)', 'Lê Hoàng Hải',
                'Phạm Văn Cường', 'Vũ Thị Hồng', 'Đỗ Minh Tuấn', 'Nguyễn Thu Thảo',
                'Trần Đình Phong', 'Hoàng Gia Bảo', 'Lâm Khải Minh', 'Nguyễn Thị Kim Anh',
                'Võ Tiến Dũng', 'Phan Thanh Bình', 'Đặng Quốc Khánh', 'Lý Gia Hào',
                'Bùi Thế Anh', 'Nguyễn Gia Lạc'
            ];
            const customerPhones = [
                '0908887766', '0912223344', '0933556677', '0978990011', '0944778899',
                '0965332211', '0922114477', '0901234567', '0987654321', '0909090909',
                '0911223344', '0955667788', '0933445566', '0907776655', '0914445556',
                '0985556667', '0973332221', '0902221113', '0961110002', '0941112223'
            ];
            const paymentMethods = ['TRANSFER', 'CASH', 'TRANSFER', 'CASH', 'TRANSFER'];
            for (let i = 1; i <= 20; i++) {
                const orderId = `ORD-2026-${1000 + i}`;
                const orderCode = `NLN-${10000 + i * 423}`;
                const nameIdx = (i - 1) % customerNames.length;
                const phoneIdx = (i - 1) % customerPhones.length;
                const payIdx = (i - 1) % paymentMethods.length;
                const totalAmount = (5 + (i % 8)) * 500000;
                const status = i <= 10 ? 'COMPLETED' : i <= 15 ? 'FAILED' : 'PENDING';
                const pdfPath = `https://api.nilonxaydung.vn/invoices/pdf/${orderId}`;
                await client.query(`
          INSERT INTO orders (id, order_code, customer_name, customer_phone, total_amount, payment_method, status, invoice_pdf)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [
                    orderId,
                    orderCode,
                    customerNames[nameIdx],
                    customerPhones[phoneIdx],
                    totalAmount,
                    paymentMethods[payIdx],
                    status,
                    pdfPath
                ]);
            }
            // 4. Seed Print Jobs (10 Jobs)
            logger.info('[Seeder] Seeding print spool queue print_jobs...');
            const spoolStatuses = [
                PrintJobStatus.COMPLETED,
                PrintJobStatus.COMPLETED,
                PrintJobStatus.COMPLETED,
                PrintJobStatus.COMPLETED,
                PrintJobStatus.COMPLETED,
                PrintJobStatus.FAILED,
                PrintJobStatus.FAILED,
                PrintJobStatus.FAILED,
                PrintJobStatus.FAILED,
                PrintJobStatus.FAILED
            ];
            for (let i = 1; i <= 10; i++) {
                const jobId = `JOB-2026-${100 + i}`;
                const orderId = `ORD-2026-${1000 + i}`;
                const printerId = i % 2 === 0 ? 'PRN-01' : 'PRN-03';
                const pdfPath = `C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\NLN-${10000 + i * 423}.pdf`;
                const status = spoolStatuses[i - 1];
                const retryCount = status === PrintJobStatus.FAILED ? 3 : 0;
                const errorMsg = status === PrintJobStatus.FAILED ? 'ERROR_PAPER_JAM: Spooler paper spindle locked.' : null;
                const printedAt = status === PrintJobStatus.COMPLETED ? new Date() : null;
                await client.query(`
          INSERT INTO print_jobs (id, order_id, printer_id, pdf_path, status, retry_count, error_message, printed_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [
                    jobId,
                    orderId,
                    printerId,
                    pdfPath,
                    status,
                    retryCount,
                    errorMsg,
                    printedAt
                ]);
            }
            // 5. Seed Failed Jobs (5 Failures)
            logger.info('[Seeder] Seeding troubleshooting failures failed_jobs...');
            for (let i = 1; i <= 5; i++) {
                const failedId = `FAIL-2026-${10 + i}`;
                const printJobId = `JOB-2026-${5 + i}`; // Jobs 6 to 10 are failed jobs in print_jobs
                const errCodes = ['ERR_PAPER_JAM', 'ERR_OFFLINE', 'ERR_OUT_OF_PAPER', 'ERR_TIMEOUT', 'ERR_SPOOL_FAIL'];
                const errMsgs = [
                    'Cutter blade jammed.',
                    'Printer disconnected. Driver offline.',
                    'Paper roll exhausted.',
                    'Spooler socket connection timed out.',
                    'Raw system printer spool buffer overflow.'
                ];
                const stackTrace = 'at PrinterManager.printPDF (src/main/printer/printer.manager.ts:182:25)\nat QueueProcessor.processJob (src/main/printer/queue.processor.ts:94:12)';
                await client.query(`
          INSERT INTO failed_jobs (id, print_job_id, error_code, error_message, stack_trace, retry_attempts)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING;
        `, [
                    failedId,
                    printJobId,
                    errCodes[i - 1],
                    errMsgs[i - 1],
                    stackTrace,
                    3
                ]);
            }
        });
        logger.info('[Seeder] Database seeded successfully.');
    }
    catch (err) {
        logger.error(`[Seeder] Seeding failed: ${err.message}`, err.stack);
        throw err;
    }
};
// If executing directly from terminal (e.g. ts-node src/main/database/seed.ts)
if (require.main === module) {
    runSeeds()
        .then(() => {
        logger.info('[Seeder] Seeder CLI command finished.');
        process.exit(0);
    })
        .catch((err) => {
        logger.error('[Seeder] CLI Execution failed.', err.stack);
        process.exit(1);
    });
}
