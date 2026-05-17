import { db } from '../postgres';
export class PrinterRepository {
    async findAll() {
        const sql = 'SELECT * FROM printers ORDER BY is_default DESC, name ASC;';
        const res = await db.executeQuery(sql);
        return res.rows;
    }
    async findById(id) {
        const sql = 'SELECT * FROM printers WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rows[0] || null;
    }
    async create(dto) {
        const sql = `
      INSERT INTO printers (id, name, paper_size, connection_type, ip_address, is_default, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, [
            dto.id,
            dto.name,
            dto.paper_size,
            dto.connection_type,
            dto.ip_address,
            dto.is_default,
            dto.is_active
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
      UPDATE printers
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
        const res = await db.executeQuery(sql, values);
        return res.rows[0] || null;
    }
    async delete(id) {
        const sql = 'DELETE FROM printers WHERE id = $1;';
        const res = await db.executeQuery(sql, [id]);
        return res.rowCount !== null && res.rowCount > 0;
    }
    async unsetDefaults() {
        const sql = 'UPDATE printers SET is_default = FALSE;';
        await db.executeQuery(sql);
    }
}
