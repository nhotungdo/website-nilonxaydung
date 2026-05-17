import { db } from '../postgres';
export class SettingsRepository {
    async findAll() {
        const sql = 'SELECT * FROM app_settings;';
        const res = await db.executeQuery(sql);
        return res.rows;
    }
    async findById(id) {
        const sql = 'SELECT * FROM app_settings WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rows[0] || null;
    }
    async getActiveSettings() {
        return this.findById(1);
    }
    async create(dto) {
        const sql = `
      INSERT INTO app_settings (id, api_url, socket_url, api_token, auto_startup, notification_sound, dark_mode)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, [
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
    async update(id, dto) {
        const fields = [];
        const values = [];
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
        const res = await db.executeQuery(sql, values);
        return res.rows[0] || null;
    }
    async delete(id) {
        const sql = 'DELETE FROM app_settings WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rowCount !== null && res.rowCount > 0;
    }
}
