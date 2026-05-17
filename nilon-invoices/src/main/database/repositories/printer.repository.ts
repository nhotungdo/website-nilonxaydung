import { db } from '../postgres';
import { Printer, CreatePrinterDTO, UpdatePrinterDTO } from '../types';

export class PrinterRepository {
  public async findAll(): Promise<Printer[]> {
    const sql = 'SELECT * FROM printers ORDER BY is_default DESC, name ASC;';
    const res = await db.executeQuery<Printer>(sql);
    return res.rows;
  }

  public async findById(id: string): Promise<Printer | null> {
    const sql = 'SELECT * FROM printers WHERE id = $1;';
    const res = await db.executeQuery<Printer>(sql, [id]);
    return res.rows[0] || null;
  }

  public async create(dto: CreatePrinterDTO): Promise<Printer> {
    const sql = `
      INSERT INTO printers (id, name, paper_size, connection_type, ip_address, is_default, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await db.executeQuery<Printer>(sql, [
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

  public async update(id: string, dto: UpdatePrinterDTO): Promise<Printer | null> {
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
      UPDATE printers
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const res = await db.executeQuery<Printer>(sql, values);
    return res.rows[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM printers WHERE id = $1;';
    const res = await db.executeQuery(sql, [id]);
    return res.rowCount !== null && res.rowCount > 0;
  }

  public async unsetDefaults(): Promise<void> {
    const sql = 'UPDATE printers SET is_default = FALSE;';
    await db.executeQuery(sql);
  }
}
