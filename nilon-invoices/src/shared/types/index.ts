export interface IPrinter {
  id: string;
  name: string;
  connection_type: 'USB' | 'LAN' | 'WIFI';
  ip_address: string | null;
  port: number | null;
  paper_size: 'K58' | 'K80';
  is_default: number; // 0 or 1
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  created_at: string;
}

export interface IPrintJob {
  id: string;
  order_id: string;
  customer_name: string;
  printer_id: string;
  pdf_path: string;
  status: 'PENDING' | 'PRINTING' | 'SUCCESS' | 'FAILED';
  retry_count: number;
  max_retries: number;
  error_message: string | null;
  created_at: string;
  printed_at: string | null;
}

export interface IFailedJob {
  id: string;
  job_id: string;
  error_type: string;
  error_message: string;
  failed_at: string;
  resolved: number; // 0 or 1
}

export interface IOfflineOrder {
  id: string;
  order_data: string; // JSON string of order structure
  sync_status: 'PENDING' | 'FAILED' | 'SYNCED';
  retry_count: number;
  created_at: string;
}

export interface IAppSettings {
  api_url: string;
  branch_id: string;
  api_key: string;
  auto_print: boolean;
  sound_alert: boolean;
  run_on_startup: boolean;
  is_online: boolean;
}

export interface ISystemLog {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  printer_id: string | null;
  message: string;
  timestamp: string;
}

// Socket/API Order schema
export interface IOrderPayload {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paperSize?: 'K58' | 'K80';
  pdfUrl?: string; // Central CDN/S3 link to PDF
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
  createdAt: string;
}
