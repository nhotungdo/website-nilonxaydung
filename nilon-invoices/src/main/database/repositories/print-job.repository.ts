import { db } from '../postgres';
import { PrintJob, CreatePrintJobDTO, UpdatePrintJobDTO } from '../types';

export class PrintJobRepository {
  public async findAll(): Promise<PrintJob[]> {
    const sql = 'SELECT * FROM print_jobs ORDER BY created_at DESC;';
    const res = await db.executeQuery<PrintJob>(sql);
    return res.rows;
  }

  public async findActive(): Promise<PrintJob[]> {
    const sql = "SELECT * FROM print_jobs WHERE status IN ('WAITING', 'PRINTING') ORDER BY created_at ASC;";
    const res = await db.executeQuery<PrintJob>(sql);
    return res.rows;
  }

  public async findHistory(limit = 100): Promise<PrintJob[]> {
    const sql = "SELECT * FROM print_jobs WHERE status IN ('COMPLETED', 'FAILED') ORDER BY created_at DESC LIMIT $1;";
    const res = await db.executeQuery<PrintJob>(sql, [limit]);
    return res.rows;
  }

  public async findById(id: string): Promise<PrintJob | null> {
    const sql = 'SELECT * FROM print_jobs WHERE id = $1;';
    const res = await db.executeQuery<PrintJob>(sql, [id]);
    return res.rows[0] || null;
  }

  public async findByOrderId(orderId: string): Promise<PrintJob | null> {
    const sql = 'SELECT * FROM print_jobs WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1;';
    const res = await db.executeQuery<PrintJob>(sql, [orderId]);
    return res.rows[0] || null;
  }

  public async create(dto: CreatePrintJobDTO): Promise<PrintJob> {
    const sql = `
      INSERT INTO print_jobs (id, order_id, printer_id, pdf_path, status, retry_count, error_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await db.executeQuery<PrintJob>(sql, [
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

  public async update(id: string, dto: UpdatePrintJobDTO): Promise<PrintJob | null> {
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
      UPDATE print_jobs
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const res = await db.executeQuery<PrintJob>(sql, values);
    return res.rows[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM print_jobs WHERE id = $1;';
    const res = await db.executeQuery(sql, [id]);
    return res.rowCount !== null && res.rowCount > 0;
  }
}
