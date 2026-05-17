export interface IPrinterOptions {
  paperSize: 'K58' | 'K80';
  copies?: number;
  silent?: boolean;
  deviceName: string;
}

export interface IPrinterDimensions {
  width: number; // in mm
  margin: number; // in mm
  fontSize: number; // default font base size
}

export const PRINTER_DIMENSIONS: Record<'K58' | 'K80', IPrinterDimensions> = {
  K58: {
    width: 58,
    margin: 2,
    fontSize: 9,
  },
  K80: {
    width: 80,
    margin: 4,
    fontSize: 11,
  },
};

export interface IPrintJobResult {
  success: boolean;
  error?: string;
}
