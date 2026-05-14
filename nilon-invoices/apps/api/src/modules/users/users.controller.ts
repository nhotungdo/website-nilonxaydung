import { Controller, Get, Put, Body, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@GetUser('sub') userId: string) {
    const user = await this.usersService.findOne(userId);
    return { success: true, data: user };
  }

  @Put('profile')
  async updateProfile(
    @GetUser('sub') userId: string,
    @Body() updateData: { fullName?: string; email?: string; phone?: string },
  ) {
    const user = await this.usersService.updateProfile(userId, updateData);
    return { success: true, data: user };
  }

  @Post('change-password')
  async changePassword(
    @GetUser('sub') userId: string,
    @Body() body: { oldPass: string; newPass: string },
  ) {
    const result = await this.usersService.changePassword(
      userId,
      body.oldPass,
      body.newPass,
    );
    return { success: true, ...result };
  }
}
