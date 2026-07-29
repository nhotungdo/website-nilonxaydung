import { IPrinter, IPrintJob, IAppSettings, ISystemLog, IOrderPayload, IFailedJob } from '../../shared/types';

// Default Branch Settings
export const mockSettings: IAppSettings = {
  api_url: 'http://localhost:3000',
  branch_id: '',
  api_key: '',
  auto_print: true,
  sound_alert: true,
  run_on_startup: false,
  is_online: true,
};

// Clean default empty printers list
export const mockPrinters: IPrinter[] = [];

// Empty structures for production and realtime workflows
export const mockOrders: IOrderPayload[] = [];
export const mockJobs: IPrintJob[] = [];
export const mockSystemLogs: ISystemLog[] = [];
export const mockFailedLogs: IFailedJob[] = [];
