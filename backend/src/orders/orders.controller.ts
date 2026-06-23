import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createOrderSchema, updateOrderStatusSchema, createCouponSchema } from './orders.schema';
import type { CreateOrderInput, UpdateOrderStatusInput, CreateCouponInput } from './orders.schema';
import { z } from 'zod';

const validateCouponDtoSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  subtotal: z.number().positive('Subtotal must be positive'),
});

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Req() req: any, @Body(new ZodValidationPipe(createOrderSchema)) createOrderDto: CreateOrderInput) {
    const userId = req.user.userId;
    const order = await this.ordersService.createOrder(userId, createOrderDto);
    return { success: true, message: 'Order placed successfully', data: order };
  }

  @Post('direct')
  async createOrderDirect(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId;
    const order = await this.ordersService.createOrderDirect(userId, body);
    return { success: true, message: 'Order placed successfully', data: order };
  }

  @Post('coupon/validate')
  async validateCoupon(
    @Body(new ZodValidationPipe(validateCouponDtoSchema)) body: { code: string; subtotal: number },
  ) {
    const couponInfo = await this.ordersService.validateCoupon(body.code, body.subtotal);
    return { success: true, data: couponInfo };
  }

  @Get()
  async getMyOrders(@Req() req: any) {
    const userId = req.user.userId;
    const orders = await this.ordersService.findAllUserOrders(userId);
    return { success: true, count: orders.length, data: orders };
  }

  @Get(':id')
  async getOrderById(@Req() req: any, @Param('id') id: string) {
    const { userId, role } = req.user;
    const order = await this.ordersService.findOneOrder(id, userId, role);
    return { success: true, data: order };
  }

  // --- ADMIN ENDPOINTS ---
  @Post('coupon')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async createCoupon(@Body(new ZodValidationPipe(createCouponSchema)) createCouponDto: CreateCouponInput) {
    const coupon = await this.ordersService.createCoupon(createCouponDto);
    return { success: true, message: 'Coupon created successfully', data: coupon };
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getAllOrders() {
    const orders = await this.ordersService.findAllOrdersAdmin();
    return { success: true, count: orders.length, data: orders };
  }

  @Patch('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateOrderStatusSchema)) body: UpdateOrderStatusInput,
  ) {
    const order = await this.ordersService.updateOrderStatusAdmin(id, body.status);
    return { success: true, message: 'Order status updated successfully', data: order };
  }
}
