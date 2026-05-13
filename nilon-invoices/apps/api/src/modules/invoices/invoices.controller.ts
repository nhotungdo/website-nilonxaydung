import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    const data = await this.invoicesService.findAll(search);
    return { success: true, data };
  }

  @Get('stats')
  async getStats() {
    const data = await this.invoicesService.getStats();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.invoicesService.findOne(id);
    return { success: true, data };
  }
}
