import { IPrinter, IPrintJob, IAppSettings, ISystemLog, IOrderPayload, IFailedJob } from '../../shared/types';

// Mock Branch Settings
export const mockSettings: IAppSettings = {
  api_url: 'https://api.nilonxaydung.vn/v1',
  branch_id: 'BRANCH-HCM-01',
  api_key: 'nl_live_8f39c298ae234fd98c12a893e9a',
  auto_print: true,
  sound_alert: true,
  run_on_startup: true,
  is_online: true,
};

// Mock Printers
export const mockPrinters: IPrinter[] = [
  {
    id: 'PRN-01',
    name: 'Thermal Cashier K80-A',
    connection_type: 'LAN',
    ip_address: '192.168.1.200',
    port: 9100,
    paper_size: 'K80',
    is_default: 1,
    status: 'ONLINE',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'PRN-02',
    name: 'Warehouse Delivery K80-B',
    connection_type: 'LAN',
    ip_address: '192.168.1.201',
    port: 9100,
    paper_size: 'K80',
    is_default: 0,
    status: 'ONLINE',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'PRN-03',
    name: 'Counter Helper K58',
    connection_type: 'USB',
    ip_address: null,
    port: null,
    paper_size: 'K58',
    is_default: 0,
    status: 'ONLINE',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'PRN-04',
    name: 'Backup POS-58 (Offline)',
    connection_type: 'USB',
    ip_address: null,
    port: null,
    paper_size: 'K58',
    is_default: 0,
    status: 'OFFLINE',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Mock Realtime Socket / API Orders
export const mockOrders: IOrderPayload[] = [
  {
    id: 'ORD-2026-0001',
    orderCode: 'NLN-78932',
    customerName: 'Nguyễn Văn Hùng (Nhà thầu)',
    customerPhone: '0903123456',
    totalAmount: 18450000,
    paperSize: 'K80',
    pdfUrl: 'https://api.nilonxaydung.vn/invoices/pdf/ORD-2026-0001',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    items: [
      { name: 'Nilon Lót Nền Khổ 2m (Dày 0.05mm) - Cuộn xanh', quantity: 5, price: 1800000, unit: 'Cuộn' },
      { name: 'Bạt Nhựa Sọc 3 Màu Che Nắng Mưa Khổ 4m x 50m', quantity: 3, price: 2150000, unit: 'Cuộn' },
      { name: 'Keo Dán Nilon Chuyên Dụng Xây Dựng 5L', quantity: 2, price: 1500000, unit: 'Thùng' }
    ]
  },
  {
    id: 'ORD-2026-0002',
    orderCode: 'NLN-78933',
    customerName: 'Đại lý Vật liệu Xây dựng Miền Nam',
    customerPhone: '0987654321',
    totalAmount: 32600000,
    paperSize: 'K80',
    pdfUrl: 'https://api.nilonxaydung.vn/invoices/pdf/ORD-2026-0002',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    items: [
      { name: 'Nilon Đen Trải Nền Bê Tông (Khổ 1.5m - 200m/cuộn)', quantity: 20, price: 1100000, unit: 'Cuộn' },
      { name: 'Màng PE Quấn Pallet Gạch 50cm (Độ co giãn 350%)', quantity: 30, price: 180000, unit: 'Cuộn' },
      { name: 'Bạt Tarpaulin PVC Xanh Cam Cao Cấp Khổ 6m x 10m', quantity: 4, price: 1300000, unit: 'Tấm' }
    ]
  },
  {
    id: 'ORD-2026-0003',
    orderCode: 'NLN-78934',
    customerName: 'Công ty Cổ phần Đầu tư Xây dựng HUD3',
    customerPhone: '0912345678',
    totalAmount: 85000000,
    paperSize: 'K80',
    pdfUrl: 'https://api.nilonxaydung.vn/invoices/pdf/ORD-2026-0003',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    items: [
      { name: 'Nilon Trắng Trải Sàn Chống Thấm Cao Cấp Dày 0.1mm', quantity: 25, price: 2400000, unit: 'Cuộn' },
      { name: 'Bạt Dứa Sọc Trắng Đỏ Che Công Trình Khổ 6m', quantity: 10, price: 2500000, unit: 'Cuộn' }
    ]
  },
  {
    id: 'ORD-2026-0004',
    orderCode: 'NLN-78935',
    customerName: 'Trần Minh Tâm (Khách lẻ)',
    customerPhone: '0938112233',
    totalAmount: 1850000,
    paperSize: 'K58',
    pdfUrl: 'https://api.nilonxaydung.vn/invoices/pdf/ORD-2026-0004',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 mins ago
    items: [
      { name: 'Nilon Lót Nền Khổ 1m (Mỏng 0.03mm) - Tái sinh', quantity: 2, price: 750000, unit: 'Cuộn' },
      { name: 'Băng keo dán bạt siêu dính rộng 10cm', quantity: 5, price: 70000, unit: 'Cuộn' }
    ]
  },
  {
    id: 'ORD-2026-0005',
    orderCode: 'NLN-78936',
    customerName: 'Lê Hoàng Hải (Nhà thầu phụ)',
    customerPhone: '0977889900',
    totalAmount: 12400000,
    paperSize: 'K80',
    pdfUrl: 'https://api.nilonxaydung.vn/invoices/pdf/ORD-2026-0005',
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(), // 55 mins ago
    items: [
      { name: 'Nilon Trải Nền Khổ 3m (Dày 0.05mm) - Cuộn đen', quantity: 4, price: 2350000, unit: 'Cuộn' },
      { name: 'Dây thừng chằng bạt che phi 12mm x 100m', quantity: 2, price: 1500000, unit: 'Cuộn' }
    ]
  }
];

// Mock Active, Completed & Failed Print Jobs
export const mockJobs: IPrintJob[] = [
  // Active queue
  {
    id: 'JOB-2026-001',
    order_id: 'ORD-2026-0001',
    customer_name: 'Nguyễn Văn Hùng (Nhà thầu)',
    printer_id: 'PRN-01',
    pdf_path: 'C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\NLN-78932.pdf',
    status: 'PRINTING',
    retry_count: 0,
    max_retries: 3,
    error_message: null,
    created_at: new Date(Date.now() - 30 * 1000).toISOString(),
    printed_at: null,
  },
  {
    id: 'JOB-2026-002',
    order_id: 'ORD-2026-0002',
    customer_name: 'Đại lý Vật liệu Xây dựng Miền Nam',
    printer_id: 'PRN-01',
    pdf_path: 'C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\NLN-78933.pdf',
    status: 'PENDING',
    retry_count: 0,
    max_retries: 3,
    error_message: null,
    created_at: new Date(Date.now() - 10 * 1000).toISOString(),
    printed_at: null,
  },
  // Success queue
  {
    id: 'JOB-2026-003',
    order_id: 'ORD-2026-0003',
    customer_name: 'Công ty Cổ phần Đầu tư Xây dựng HUD3',
    printer_id: 'PRN-01',
    pdf_path: 'C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\NLN-78934.pdf',
    status: 'SUCCESS',
    retry_count: 1,
    max_retries: 3,
    error_message: null,
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    printed_at: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
  },
  {
    id: 'JOB-2026-004',
    order_id: 'ORD-2026-0004',
    customer_name: 'Trần Minh Tâm (Khách lẻ)',
    printer_id: 'PRN-03',
    pdf_path: 'C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\NLN-78935.pdf',
    status: 'SUCCESS',
    retry_count: 0,
    max_retries: 3,
    error_message: null,
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    printed_at: new Date(Date.now() - 39 * 60 * 1000).toISOString(),
  },
  // Failed queue
  {
    id: 'JOB-2026-005',
    order_id: 'ORD-2026-0005',
    customer_name: 'Lê Hoàng Hải (Nhà thầu phụ)',
    printer_id: 'PRN-04',
    pdf_path: 'C:\\Users\\MY PC\\AppData\\Local\\Temp\\invoices\\NLN-78936.pdf',
    status: 'FAILED',
    retry_count: 3,
    max_retries: 3,
    error_message: 'PRINTER_OFFLINE: Connection reset, check USB cable',
    created_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    printed_at: null,
  }
];

// Mock System Diagnostics Logs
export const mockSystemLogs: ISystemLog[] = [
  {
    id: 1,
    level: 'INFO',
    printer_id: null,
    message: 'System Initialized. Nilon Invoices Client v1.0.0 is ready.',
    timestamp: new Date(Date.now() - 50000).toISOString(),
  },
  {
    id: 2,
    level: 'INFO',
    printer_id: null,
    message: 'SQLite database connection active. Migration status check: SUCCESS',
    timestamp: new Date(Date.now() - 45000).toISOString(),
  },
  {
    id: 3,
    level: 'INFO',
    printer_id: null,
    message: 'Printers list queried. Found 3 online, 1 offline local drivers.',
    timestamp: new Date(Date.now() - 40000).toISOString(),
  },
  {
    id: 4,
    level: 'INFO',
    printer_id: null,
    message: 'Socket.IO client initiating connection to central NestJS server...',
    timestamp: new Date(Date.now() - 35000).toISOString(),
  },
  {
    id: 5,
    level: 'INFO',
    printer_id: null,
    message: 'Socket.IO Client status altered: CONNECTED. Room: BRANCH-HCM-01 joined.',
    timestamp: new Date(Date.now() - 30000).toISOString(),
  },
  {
    id: 6,
    level: 'INFO',
    printer_id: 'PRN-01',
    message: 'Active Print Spooler monitoring connected. Default printer is: Thermal Cashier K80-A',
    timestamp: new Date(Date.now() - 25000).toISOString(),
  },
  {
    id: 7,
    level: 'WARN',
    printer_id: 'PRN-04',
    message: 'Telemetry reporting: Connection to "Backup POS-58" was closed. Check USB cable.',
    timestamp: new Date(Date.now() - 15000).toISOString(),
  },
  {
    id: 8,
    level: 'ERROR',
    printer_id: 'PRN-04',
    message: 'Print Queue execution failed on Job JOB-2026-005. PRINTER_OFFLINE error thrown.',
    timestamp: new Date(Date.now() - 10000).toISOString(),
  }
];

// Mock Failed Jobs detailed analytics logs
export const mockFailedLogs: IFailedJob[] = [
  {
    id: 'FL-001',
    job_id: 'JOB-2026-005',
    error_type: 'PRINTER_OFFLINE',
    error_message: 'PRINTER_OFFLINE: Connection reset, check USB cable',
    failed_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    resolved: 0,
  },
  {
    id: 'FL-002',
    job_id: 'JOB-2026-006',
    error_type: 'PAPER_JAM',
    error_message: 'PAPER_JAM: Spindle blocked or paper cut jam detected',
    failed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolved: 1,
  },
  {
    id: 'FL-003',
    job_id: 'JOB-2026-007',
    error_type: 'OUT_OF_PAPER',
    error_message: 'OUT_OF_PAPER: Thermal paper roll is empty or not loaded',
    failed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    resolved: 1,
  }
];
