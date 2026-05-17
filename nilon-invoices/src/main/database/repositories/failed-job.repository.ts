import { db } from '../postgres';
import { FailedJob, CreateFailedJobDTO, UpdateFailedJobDTO } from '../types';

export class FailedJobRepository {
  public async findAll(): Promise<FailedJob[]> {
    const sql = 'SELECT * FROM failed_jobs ORDER BY created_at DESC;';
    const res = await db.executeQuery<FailedJob>(sql);
    return res.rows;
  }

  public async findById(id: string): Promise<FailedJob | null> {
    const sql = 'SELECT * FROM failed_jobs WHERE id = $1;';
    const res = await db.executeQuery<FailedJob>(sql, [id]);
    return res.rows[0] || null;
  }

  public async findByPrintJobId(printJobId: string): Promise<FailedJob | null> {
    const sql = 'SELECT * FROM failed_jobs WHERE print_job_id = $1;';
    const res = await db.executeQuery<FailedJob>(sql, [printJobId]);
    return res.rows[0] || null;
  }

  public async create(dto: CreateFailedJobDTO): Promise<FailedJob> {
    const sql = `
      INSERT INTO failed_jobs (id, print_job_id, error_code, error_message, stack_trace, retry_attempts)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await db.executeQuery<FailedJob>(sql, [
      dto.id,
      dto.print_job_id,
      dto.error_code,
      dto.error_message,
      dto.stack_trace,
      dto.retry_attempts
    ]);
    return res.rows[0];
  }

  public async update(id: string, dto: UpdateFailedJobDTO): Promise<FailedJob | null> {
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
      UPDATE failed_jobs
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const res = await db.executeQuery<FailedJob>(sql, values);
    return res.rows[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM failed_jobs WHERE id = $1;';
    const res = await db.executeQuery(sql, [id]);
    return res.rowCount !== null && res.rowCount > 0;
  }

  public async deleteByPrintJobId(printJobId: string): Promise<boolean> {
    const sql = 'DELETE FROM failed_jobs WHERE print_job_id = $1;';
    const res = await db.executeQuery(sql, [printJobId]);
    return res.rowCount !== null && res.rowCount > 0;
  }
}
