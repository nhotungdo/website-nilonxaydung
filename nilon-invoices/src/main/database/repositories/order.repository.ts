import { db } from '../postgres';
import { Order, UpdateOrderDTO } from '../types';

export class OrderRepository {
  public async findAll(): Promise<Order[]> {
    // 1. Fetch all orders and their linked customer details
    const ordersSql = `
      SELECT 
        o.id,
        o.order_code,
        o.subtotal,
        o.shipping_fee,
        o.total,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.print_status,
        o.note,
        o.created_at,
        o.updated_at,
        o.printed_at,
        o.printed_by,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        c.address AS customer_address
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC;
    `;
    const ordersRes = await db.executeQuery<any>(ordersSql);
    const orders = ordersRes.rows;

    if (orders.length === 0) return [];

    // 2. Fetch all order items in a single query to prevent N+1 queries
    const itemsSql = `
      SELECT 
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.total
      FROM order_items oi;
    `;
    const itemsRes = await db.executeQuery<any>(itemsSql);
    const allItems = itemsRes.rows;

    // 3. Map items and fields to the Order type shape
    return orders.map(o => {
      const items = allItems.filter(item => item.order_id === o.id);
      return {
        ...o,
        total_amount: Number(o.total),
        items
      };
    });
  }

  public async findById(id: string): Promise<Order | null> {
    const orderSql = `
      SELECT 
        o.id,
        o.order_code,
        o.subtotal,
        o.shipping_fee,
        o.total,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.print_status,
        o.note,
        o.created_at,
        o.updated_at,
        o.printed_at,
        o.printed_by,
        c.full_name AS customer_name,
        c.phone AS customer_phone,
        c.address AS customer_address
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1;
    `;
    const orderRes = await db.executeQuery<any>(orderSql, [id]);
    const order = orderRes.rows[0];

    if (!order) return null;

    // Fetch items for this single order
    const itemsSql = `
      SELECT 
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.total
      FROM order_items oi
      WHERE oi.order_id = $1;
    `;
    const itemsRes = await db.executeQuery<any>(itemsSql, [id]);
    
    return {
      ...order,
      total_amount: Number(order.total),
      items: itemsRes.rows
    };
  }

  public async create(dto: any): Promise<Order> {
    let customerId = dto.customer_id;
    
    // Find or create customer by phone if not explicitly linked by customer_id
    if (!customerId) {
      const custSql = 'SELECT id FROM customers WHERE phone = $1;';
      const custRes = await db.executeQuery<any>(custSql, [dto.customer_phone || 'N/A']);
      
      if (custRes.rows.length > 0) {
        customerId = custRes.rows[0].id;
      } else {
        const insertCustSql = `
          INSERT INTO customers (id, full_name, phone, address)
          VALUES ($1, $2, $3, $4)
          RETURNING id;
        `;
        const uuid = require('crypto').randomUUID();
        const insertRes = await db.executeQuery<any>(insertCustSql, [
          uuid,
          dto.customer_name || 'Khách lẻ',
          dto.customer_phone || '0000000000',
          dto.customer_address || 'N/A'
        ]);
        customerId = insertRes.rows[0].id;
      }
    }

    const orderSql = `
      INSERT INTO orders (id, order_code, customer_id, subtotal, shipping_fee, total, payment_method, print_status, note)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const orderRes = await db.executeQuery<any>(orderSql, [
      dto.id,
      dto.order_code,
      customerId,
      dto.total_amount || 0,
      0,
      dto.total_amount || 0,
      dto.payment_method || 'COD',
      dto.print_status || 'waiting',
      dto.note || ''
    ]);

    const createdOrder = orderRes.rows[0];
    
    // Insert order items if provided
    if (dto.items && Array.isArray(dto.items)) {
      for (const item of dto.items) {
        const itemSql = `
          INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, total)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        const itemUuid = require('crypto').randomUUID();
        await db.executeQuery(itemSql, [
          itemUuid,
          createdOrder.id,
          item.product_id || 'fallback-product-id',
          item.product_name || item.name,
          item.price,
          item.quantity,
          item.price * item.quantity
        ]);
      }
    }

    const fullOrder = await this.findById(createdOrder.id);
    if (!fullOrder) {
      throw new Error(`Failed to retrieve newly created order ${createdOrder.id}`);
    }
    return fullOrder;
  }

  public async update(id: string, dto: UpdateOrderDTO): Promise<Order | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(dto).forEach(([key, val]) => {
      // Map properties if needed (but types match schema directly)
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

    await db.executeQuery<Order>(sql, values);
    return this.findById(id);
  }

  public async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM orders WHERE id = $1;';
    const res = await db.executeQuery(sql, [id]);
    return res.rowCount !== null && res.rowCount > 0;
  }
}
