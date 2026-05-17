import { db } from '../postgres';
export class PrintJobRepository {
    async findAll() {
        const sql = 'SELECT * FROM print_jobs ORDER BY created_at DESC;';
        const res = await db.executeQuery(sql);
        return res.rows;
    }
    async findActive() {
        const sql = "SELECT * FROM print_jobs WHERE status IN ('WAITING', 'PRINTING') ORDER BY created_at ASC;";
        const res = await db.executeQuery(sql);
        return res.rows;
    }
    async findHistory(limit = 100) {
        const sql = "SELECT * FROM print_jobs WHERE status IN ('COMPLETED', 'FAILED') ORDER BY created_at DESC LIMIT $1;";
        const res = await db.executeQuery(sql, [limit]);
        return res.rows;
    }
    async findById(id) {
        const sql = 'SELECT * FROM print_jobs WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rows[0] || null;
    }
    async findByOrderId(orderId) {
        const sql = 'SELECT * FROM print_jobs WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1;';
        const res = await db.executeQuery(sql, [orderId]);
        return res.rows[0] || null;
    }
    async create(dto) {
        const sql = `
      INSERT INTO print_jobs (id, order_id, printer_id, pdf_path, status, retry_count, error_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, [
            dto.id,
            dto.order_id,
            dto.printer_id,
            dto.pdf_path,
            dto.status,
            dto.retry_count,
            dto.error_message
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
      UPDATE print_jobs
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, values);
        return res.rows[0] || null;
    }
    async delete(id) {
        const sql = 'DELETE FROM print_jobs WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rowCount !== null && res.rowCount > 0;
    }
}
