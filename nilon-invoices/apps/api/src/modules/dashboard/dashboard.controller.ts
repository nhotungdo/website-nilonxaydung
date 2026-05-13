import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    const data = await this.dashboardService.getStats();
    return { success: true, data };
  }

  @Get('revenue-chart')
  async getRevenueChart() {
    const data = await this.dashboardService.getRevenueChart();
    return { success: true, data };
  }

  @Get('top-products')
  async getTopProducts() {
    const data = await this.dashboardService.getTopProducts();
    return { success: true, data };
  }

  @Get('order-status')
  async getOrderStatusCounts() {
    const data = await this.dashboardService.getOrderStatusCounts();
    return { success: true, data };
  }
}
