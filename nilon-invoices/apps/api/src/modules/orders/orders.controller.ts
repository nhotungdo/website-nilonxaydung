import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.ordersService.findAll(search, status);
    return { success: true, data };
  }

  @Get('recent')
  async findRecent(@Query('limit') limit?: string) {
    const data = await this.ordersService.findRecent(
      limit ? parseInt(limit) : 5,
    );
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.ordersService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const data = await this.ordersService.updateStatus(id, body.status);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return { success: true, data: null };
  }
}
