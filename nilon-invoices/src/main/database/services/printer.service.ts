import { PrinterRepository } from '../repositories/printer.repository';
import { Printer, CreatePrinterDTO, UpdatePrinterDTO } from '../types';
import { logger } from '../../utils/logger';

export class PrinterService {
  private repo = new PrinterRepository();

  public async getPrinters(): Promise<Printer[]> {
    return await this.repo.findAll();
  }

  public async getPrinterById(id: string): Promise<Printer | null> {
    return await this.repo.findById(id);
  }

  public async addPrinter(dto: CreatePrinterDTO): Promise<Printer> {
    // 1. Validation
    if (!dto.name || dto.name.trim() === '') {
      throw new Error('Printer name cannot be blank.');
    }

    if (dto.connection_type === 'LAN' || dto.connection_type === 'WIFI') {
      if (!dto.ip_address || dto.ip_address.trim() === '') {
        throw new Error('Network printers (LAN/WIFI) must specify a valid IP address.');
      }
    }

    // 2. Default logic: If this printer is default, unset other defaults first
    if (dto.is_default) {
      logger.info(`[PrinterService] Setting ${dto.name} as default printer.`);
      await this.repo.unsetDefaults();
    }

    logger.info(`[PrinterService] Registering new printer: ${dto.name}`);
    return await this.repo.create(dto);
  }

  public async updatePrinter(id: string, dto: UpdatePrinterDTO): Promise<Printer | null> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Printer with ID ${id} not found.`);
    }

    if (dto.is_default) {
      logger.info(`[PrinterService] Updating default printer to ID: ${id}`);
      await this.repo.unsetDefaults();
    }

    return await this.repo.update(id, dto);
  }

  public async setDefaultPrinter(id: string): Promise<boolean> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Printer with ID ${id} not found.`);
    }

    logger.info(`[PrinterService] Setting default printer to: ${existing.name}`);
    await this.repo.unsetDefaults();
    const updated = await this.repo.update(id, { is_default: true });
    return updated !== null;
  }

  public async deletePrinter(id: string): Promise<boolean> {
    logger.info(`[PrinterService] Deleting printer registration: ${id}`);
    return await this.repo.delete(id);
  }
}
