import { db } from '../postgres';
import { AppSettings } from '../types';

export class SettingsRepository {
  public async findAll(): Promise<AppSettings[]> {
    const sql = 'SELECT * FROM app_settings;';
    const res = await db.executeQuery<AppSettings>(sql);
    return res.rows;
  }

  public async findById(id: number): Promise<AppSettings | null> {
    const sql = 'SELECT * FROM app_settings WHERE id = $1;';
    const res = await db.executeQuery<AppSettings>(sql, [id]);
    return res.rows[0] || null;
  }

  public async getActiveSettings(): Promise<AppSettings | null> {
    return this.findById(1);
  }

  public async create(dto: AppSettings): Promise<AppSettings> {
    const sql = `
      INSERT INTO app_settings (id, api_url, socket_url, api_token, auto_startup, notification_sound, dark_mode)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await db.executeQuery<AppSettings>(sql, [
      dto.id,
      dto.api_url,
      dto.socket_url,
      dto.api_token,
      dto.auto_startup,
      dto.notification_sound,
      dto.dark_mode
    ]);
    return res.rows[0];
  }

  public async update(id: number, dto: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(dto).forEach(([key, val]) => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(val);
      paramIndex++;
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE app_settings
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const res = await db.executeQuery<AppSettings>(sql, values);
    return res.rows[0] || null;
  }

  public async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM app_settings WHERE id = $1;';
    const res = await db.executeQuery(sql, [id]);
    return res.rowCount !== null && res.rowCount > 0;
  }
}
