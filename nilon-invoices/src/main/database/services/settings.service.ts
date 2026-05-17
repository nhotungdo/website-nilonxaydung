import { SettingsRepository } from '../repositories/settings.repository';
import { AppSettings } from '../types';
import { logger } from '../../utils/logger';

export class SettingsService {
  private repo = new SettingsRepository();

  public async getSettings(): Promise<AppSettings | null> {
    return await this.repo.getActiveSettings();
  }

  public async saveSettings(dto: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings | null> {
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
      const defaultSettings: AppSettings = {
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
