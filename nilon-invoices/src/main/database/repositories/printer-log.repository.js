import { db } from '../postgres';
export class PrinterLogRepository {
    async findAll(limit = 200) {
        const sql = 'SELECT * FROM printer_logs ORDER BY created_at DESC LIMIT $1;';
        const res = await db.executeQuery(sql, [limit]);
        return res.rows;
    }
    async findById(id) {
        const sql = 'SELECT * FROM printer_logs WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rows[0] || null;
    }
    async findByPrinterId(printerId, limit = 100) {
        const sql = 'SELECT * FROM printer_logs WHERE printer_id = $1 ORDER BY created_at DESC LIMIT $2;';
        const res = await db.executeQuery(sql, [printerId, limit]);
        return res.rows;
    }
    async create(dto) {
        const sql = `
      INSERT INTO printer_logs (printer_id, log_level, message, metadata)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, [
            dto.printer_id,
            dto.log_level,
            dto.message,
            dto.metadata
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
      UPDATE printer_logs
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, values);
        return res.rows[0] || null;
    }
    async delete(id) {
        const sql = 'DELETE FROM printer_logs WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rowCount !== null && res.rowCount > 0;
    }
    async clearAll() {
        const sql = 'TRUNCATE TABLE printer_logs;';
        await db.executeQuery(sql);
    }
}
