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

// Empty structures for production and realtime workflows
export const mockOrders: IOrderPayload[] = [];
export const mockJobs: IPrintJob[] = [];
export const mockSystemLogs: ISystemLog[] = [];
export const mockFailedLogs: IFailedJob[] = [];
