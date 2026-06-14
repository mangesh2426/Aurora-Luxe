import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { addToCartSchema, updateCartItemSchema } from './cart.schema';
import type { AddToCartInput, UpdateCartItemInput } from './cart.schema';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user.userId;
    const cart = await this.cartService.getOrCreateCart(userId);
    return { success: true, data: cart };
  }

  @Post()
  async addToCart(@Req() req: any, @Body(new ZodValidationPipe(addToCartSchema)) addToCartDto: AddToCartInput) {
    const userId = req.user.userId;
    const cartItem = await this.cartService.addToCart(userId, addToCartDto);
    return { success: true, message: 'Item added to cart', data: cartItem };
  }

  @Patch(':id')
  async updateQuantity(
    @Req() req: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCartItemSchema)) updateCartItemDto: UpdateCartItemInput,
  ) {
    const userId = req.user.userId;
    const cartItem = await this.cartService.updateQuantity(userId, id, updateCartItemDto.quantity);
    return { success: true, message: 'Cart item quantity updated', data: cartItem };
  }

  @Delete(':id')
  async removeItem(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.cartService.removeItem(userId, id);
    return { success: true, message: 'Item removed from cart' };
  }

  @Delete()
  async clearCart(@Req() req: any) {
    const userId = req.user.userId;
    await this.cartService.clearCart(userId);
    return { success: true, message: 'Cart cleared successfully' };
  }
}
