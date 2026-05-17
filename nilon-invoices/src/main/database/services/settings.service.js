import { SettingsRepository } from '../repositories/settings.repository';
import { logger } from '../../utils/logger';
export class SettingsService {
    repo = new SettingsRepository();
    async getSettings() {
        return await this.repo.getActiveSettings();
    }
    async saveSettings(dto) {
        logger.info(`[SettingsService] Updating application settings parameters.`);
        if (dto.api_url && !dto.api_url.startsWith('http://') && !dto.api_url.startsWith('https://')) {
            throw new Error('API Url must begin with http:// or https://');
        }
        if (dto.socket_url && !dto.socket_url.startsWith('http://') && !dto.socket_url.startsWith('https://')) {
            throw new Error('Socket Url must begin with http:// or https://');
        }
        const current = await this.repo.getActiveSettings();
        if (!current) {
            // Create initial settings row
            const defaultSettings = {
                id: 1,
                api_url: dto.api_url || 'http://localhost:3000',
                socket_url: dto.socket_url || 'http://localhost:3000',
                api_token: dto.api_token || 'nilon_sec_auth_key_2026',
                auto_startup: dto.auto_startup !== undefined ? dto.auto_startup : false,
                notification_sound: dto.notification_sound !== undefined ? dto.notification_sound : true,
                dark_mode: dto.dark_mode !== undefined ? dto.dark_mode : true
            };
            return await this.repo.create(defaultSettings);
        }
        return await this.repo.update(1, dto);
    }
}
