import { OrderRepository } from '../repositories/order.repository';
import { Order, CreateOrderDTO, UpdateOrderDTO } from '../types';
import { logger } from '../../utils/logger';

export class OrderService {
  private repo = new OrderRepository();

  public async getOrders(): Promise<Order[]> {
    return await this.repo.findAll();
  }

  public async getOrderById(id: string): Promise<Order | null> {
    return await this.repo.findById(id);
  }

  public async createOrder(dto: CreateOrderDTO): Promise<Order> {
    // Enforce business rules
    if (!dto.id || dto.id.trim() === '') {
      throw new Error('Order primary key ID must be specified.');
    }

    if (!dto.order_code || dto.order_code.trim() === '') {
      throw new Error('Order code registration cannot be blank.');
    }

    if (!dto.customer_name || dto.customer_name.trim() === '') {
      throw new Error('Customer name must not be empty.');
    }

    if (dto.total_amount < 0) {
      throw new Error('Total order amount cannot be negative.');
    }

    // Check code duplication
    const existing = await this.repo.findById(dto.id);
    if (existing) {
      logger.warn(`[OrderService] Order with ID ${dto.id} already exists. Skipping insertion and automatic printing.`);
      return existing;
    }

    logger.info(`[OrderService] Persisting new sales order: ${dto.order_code} for ${dto.customer_name}`);
    const newOrder = await this.repo.create(dto);

    // Automatically trigger physical print command only for new database orders
    try {
      const { invoiceService } = require('../../../services/invoice.service');
      const orderPayload = {
        id: newOrder.id,
        orderCode: newOrder.order_code,
        customerName: newOrder.customer_name,
        customerPhone: newOrder.customer_phone,
        totalAmount: Number(newOrder.total_amount),
        pdfUrl: newOrder.invoice_pdf || undefined,
        createdAt: newOrder.created_at ? newOrder.created_at.toISOString() : new Date().toISOString(),
        items: [] // Line items will be loaded dynamically by invoice print template
      };
      await invoiceService.processIncomingOrder(orderPayload);
      logger.info(`[OrderService] Automatically dispatched invoice print job for new order: ${newOrder.order_code}`);
    } catch (printErr: any) {
      logger.error(`[OrderService] Failed to automatically print invoice for new order ${newOrder.order_code}: ${printErr.message}`);
    }

    return newOrder;
  }

  public async updateOrder(id: string, dto: UpdateOrderDTO): Promise<Order | null> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Order ${id} not found.`);
    }

    return await this.repo.update(id, dto);
  }

  public async deleteOrder(id: string): Promise<boolean> {
    logger.info(`[OrderService] Deleting order log: ${id}`);
    return await this.repo.delete(id);
  }
}
