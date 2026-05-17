import { OrderRepository } from '../repositories/order.repository';
import { logger } from '../../utils/logger';
export class OrderService {
    repo = new OrderRepository();
    async getOrders() {
        return await this.repo.findAll();
    }
    async getOrderById(id) {
        return await this.repo.findById(id);
    }
    async createOrder(dto) {
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
            logger.warn(`[OrderService] Order with ID ${dto.id} already exists. Skipping insertion.`);
            return existing;
        }
        logger.info(`[OrderService] Persisting new sales order: ${dto.order_code} for ${dto.customer_name}`);
        return await this.repo.create(dto);
    }
    async updateOrder(id, dto) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new Error(`Order ${id} not found.`);
        }
        return await this.repo.update(id, dto);
    }
    async deleteOrder(id) {
        logger.info(`[OrderService] Deleting order log: ${id}`);
        return await this.repo.delete(id);
    }
}
