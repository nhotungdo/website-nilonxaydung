import { db } from '../postgres';
import { Order, CreateOrderDTO, UpdateOrderDTO } from '../types';

export class OrderRepository {
  public async findAll(): Promise<Order[]> {
    const sql = 'SELECT * FROM orders ORDER BY created_at DESC;';
    const res = await db.executeQuery<Order>(sql);
    return res.rows;
  }

  public async findById(id: string): Promise<Order | null> {
    const sql = 'SELECT * FROM orders WHERE id = $1;';
    const res = await db.executeQuery<Order>(sql, [id]);
    return res.rows[0] || null;
  }

  public async create(dto: CreateOrderDTO): Promise<Order> {
    const sql = `
      INSERT INTO orders (id, order_code, customer_name, customer_phone, total_amount, payment_method, status, invoice_pdf)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const res = await db.executeQuery<Order>(sql, [
      dto.id,
      dto.order_code,
      dto.customer_name,
      dto.customer_phone,
      dto.total_amount,
      dto.payment_method,
      dto.status,
      dto.invoice_pdf
    ]);
    return res.rows[0];
  }

  public async update(id: string, dto: UpdateOrderDTO): Promise<Order | null> {
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
      UPDATE orders
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const res = await db.executeQuery<Order>(sql, values);
    return res.rows[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM orders WHERE id = $1;';
    const res = await db.executeQuery(sql, [id]);
    return res.rowCount !== null && res.rowCount > 0;
  }
}
