import { PrinterRepository } from '../repositories/printer.repository';
import { logger } from '../../utils/logger';
export class PrinterService {
    repo = new PrinterRepository();
    async getPrinters() {
        return await this.repo.findAll();
    }
    async getPrinterById(id) {
        return await this.repo.findById(id);
    }
    async addPrinter(dto) {
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
    async updatePrinter(id, dto) {
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
    async setDefaultPrinter(id) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new Error(`Printer with ID ${id} not found.`);
        }
        logger.info(`[PrinterService] Setting default printer to: ${existing.name}`);
        await this.repo.unsetDefaults();
        const updated = await this.repo.update(id, { is_default: true });
        return updated !== null;
    }
    async deletePrinter(id) {
        logger.info(`[PrinterService] Deleting printer registration: ${id}`);
        return await this.repo.delete(id);
    }
}
