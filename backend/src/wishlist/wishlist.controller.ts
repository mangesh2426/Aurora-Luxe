import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { z } from 'zod';

const addToWishlistSchema = z.object({
  productId: z.string().uuid('Invalid Product ID'),
});

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Req() req: any) {
    const userId = req.user.userId;
    const wishlist = await this.wishlistService.getOrCreateWishlist(userId);
    return { success: true, data: wishlist };
  }

  @Post()
  async addToWishlist(
    @Req() req: any,
    @Body(new ZodValidationPipe(addToWishlistSchema)) body: { productId: string },
  ) {
    const userId = req.user.userId;
    const item = await this.wishlistService.addToWishlist(userId, body.productId);
    return { success: true, message: 'Item added to wishlist', data: item };
  }

  @Delete(':productId')
  async removeFromWishlist(@Req() req: any, @Param('productId') productId: string) {
    const userId = req.user.userId;
    await this.wishlistService.removeFromWishlist(userId, productId);
    return { success: true, message: 'Item removed from wishlist' };
  }
}
