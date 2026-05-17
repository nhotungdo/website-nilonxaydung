import { db } from '../postgres';
export class FailedJobRepository {
    async findAll() {
        const sql = 'SELECT * FROM failed_jobs ORDER BY created_at DESC;';
        const res = await db.executeQuery(sql);
        return res.rows;
    }
    async findById(id) {
        const sql = 'SELECT * FROM failed_jobs WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rows[0] || null;
    }
    async findByPrintJobId(printJobId) {
        const sql = 'SELECT * FROM failed_jobs WHERE print_job_id = $1;';
        const res = await db.executeQuery(sql, [printJobId]);
        return res.rows[0] || null;
    }
    async create(dto) {
        const sql = `
      INSERT INTO failed_jobs (id, print_job_id, error_code, error_message, stack_trace, retry_attempts)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, [
            dto.id,
            dto.print_job_id,
            dto.error_code,
            dto.error_message,
            dto.stack_trace,
            dto.retry_attempts
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
      UPDATE failed_jobs
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, values);
        return res.rows[0] || null;
    }
    async delete(id) {
        const sql = 'DELETE FROM failed_jobs WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rowCount !== null && res.rowCount > 0;
    }
    async deleteByPrintJobId(printJobId) {
        const sql = 'DELETE FROM failed_jobs WHERE print_job_id = $1;';
        const res = await db.executeQuery(sql, [printJobId]);
        return res.rowCount !== null && res.rowCount > 0;
    }
}
