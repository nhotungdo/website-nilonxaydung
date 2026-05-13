import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    const data = await this.customersService.findAll(search);
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.customersService.findOne(id);
    return { success: true, data };
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      taxCode?: string;
    },
  ) {
    const data = await this.customersService.create(body);
    return { success: true, data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
      taxCode: string;
    }>,
  ) {
    const data = await this.customersService.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.customersService.remove(id);
    return { success: true, data: null };
  }
}
