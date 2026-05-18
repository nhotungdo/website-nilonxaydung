export enum ConnectionType {
  USB = 'USB',
  LAN = 'LAN',
  WIFI = 'WIFI'
}

export enum PaperSize {
  K58 = 'K58',
  K80 = 'K80'
}

export enum PrintJobStatus {
  WAITING = 'WAITING',
  PRINTING = 'PRINTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface Printer {
  id: string;
  name: string;
  paper_size: PaperSize;
  connection_type: ConnectionType;
  ip_address: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: Date;
}

export interface PrintJob {
  id: string;
  order_id: string;
  printer_id: string;
  pdf_path: string;
  status: PrintJobStatus;
  retry_count: number;
  max_retries?: number;
  error_message: string | null;
  created_at: Date;
  printed_at: Date | null;
}

export interface FailedJob {
  id: string;
  print_job_id: string;
  error_code: string;
  error_message: string;
  stack_trace: string | null;
  retry_attempts: number;
  created_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  subtotal?: number;
  shipping_fee?: number;
  total_amount: number; // mapped from total
  payment_method: string;
  payment_status: string;
  order_status: string;
  print_status: string;
  note?: string | null;
  invoice_pdf?: string | null;
  created_at: Date;
  updated_at?: Date;
  printed_at?: Date | null;
  printed_by?: string | null;
  items?: OrderItem[];
}

export interface AppSettings {
  id: number;
  api_url: string;
  socket_url: string;
  api_token: string;
  auto_startup: boolean;
  notification_sound: boolean;
  dark_mode: boolean;
}

export interface PrinterLog {
  id: number;
  printer_id: string | null;
  log_level: LogLevel;
  message: string;
  metadata: string | null; // JSON String or plain text
  created_at: Date;
}

// Data Transfer Objects (DTOs) for insertions and updates
export type CreatePrinterDTO = Omit<Printer, 'created_at'>;
export type UpdatePrinterDTO = Partial<Omit<Printer, 'id' | 'created_at'>>;

export type CreatePrintJobDTO = Omit<PrintJob, 'created_at' | 'printed_at'>;
export type UpdatePrintJobDTO = Partial<Omit<PrintJob, 'id' | 'created_at'>>;

export type CreateFailedJobDTO = Omit<FailedJob, 'created_at'>;
export type UpdateFailedJobDTO = Partial<Omit<FailedJob, 'id' | 'created_at'>>;

export type CreateOrderDTO = Omit<Order, 'created_at'>;
export type UpdateOrderDTO = Partial<Omit<Order, 'id' | 'created_at'>>;

export type CreatePrinterLogDTO = Omit<PrinterLog, 'id' | 'created_at'>;
