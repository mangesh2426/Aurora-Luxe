import { Controller, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Role } from '@prisma/client';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
});

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, data: stats };
  }

  @Get('users')
  async getUsers() {
    const users = await this.adminService.getAllUsers();
    return { success: true, count: users.length, data: users };
  }

  @Patch('users/:id/role')
  async updateRole(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateRoleSchema)) body: { role: Role },
  ) {
    const user = await this.adminService.updateUserRole(id, body.role);
    return { success: true, message: 'User role updated successfully', data: user };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return { success: true, message: 'User account deleted successfully' };
  }
}
