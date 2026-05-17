import { db } from '../postgres';
import { PrinterLog, CreatePrinterLogDTO } from '../types';

export class PrinterLogRepository {
  public async findAll(limit = 200): Promise<PrinterLog[]> {
    const sql = 'SELECT * FROM printer_logs ORDER BY created_at DESC LIMIT $1;';
    const res = await db.executeQuery<PrinterLog>(sql, [limit]);
    return res.rows;
  }

  public async findById(id: number): Promise<PrinterLog | null> {
    const sql = 'SELECT * FROM printer_logs WHERE id = $1;';
    const res = await db.executeQuery<PrinterLog>(sql, [id]);
    return res.rows[0] || null;
  }

  public async findByPrinterId(printerId: string, limit = 100): Promise<PrinterLog[]> {
    const sql = 'SELECT * FROM printer_logs WHERE printer_id = $1 ORDER BY created_at DESC LIMIT $2;';
    const res = await db.executeQuery<PrinterLog>(sql, [printerId, limit]);
    return res.rows;
  }

  public async create(dto: CreatePrinterLogDTO): Promise<PrinterLog> {
    const sql = `
      INSERT INTO printer_logs (printer_id, log_level, message, metadata)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await db.executeQuery<PrinterLog>(sql, [
      dto.printer_id,
      dto.log_level,
      dto.message,
      dto.metadata
    ]);
    return res.rows[0];
  }

  public async update(id: number, dto: Partial<Omit<PrinterLog, 'id' | 'created_at'>>): Promise<PrinterLog | null> {
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
      UPDATE printer_logs
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const res = await db.executeQuery<PrinterLog>(sql, values);
    return res.rows[0] || null;
  }

  public async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM printer_logs WHERE id = $1;';
    const res = await db.executeQuery(sql, [id]);
    return res.rowCount !== null && res.rowCount > 0;
  }

  public async clearAll(): Promise<void> {
    const sql = 'TRUNCATE TABLE printer_logs;';
    await db.executeQuery(sql);
  }
}
