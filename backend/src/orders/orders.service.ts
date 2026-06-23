import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput, CreateCouponInput } from './orders.schema';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // --- Coupon Operations ---
  async createCoupon(data: CreateCouponInput) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) {
      throw new ConflictException('Coupon code already exists');
    }

    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discount: data.discount,
        type: data.type,
        minPurchase: data.minPurchase ?? 0,
        maxDiscount: data.maxDiscount,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive ?? true,
      },
    });
  }

  async validateCoupon(code: string, subtotal: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is inactive');
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new BadRequestException('Coupon is expired or not yet active');
    }

    if (subtotal < Number(coupon.minPurchase)) {
      throw new BadRequestException(`Minimum purchase of $${coupon.minPurchase} required`);
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = subtotal * (Number(coupon.discount) / 100);
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      discountAmount = Number(coupon.discount);
    }

    // Discount cannot exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
    };
  }

  // --- Order Operations ---
  async createOrder(userId: string, data: CreateOrderInput) {
    // 1. Get user cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    // 2. Get shipping address and verify ownership
    const address = await this.prisma.address.findUnique({
      where: { id: data.addressId },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Invalid shipping address selected');
    }

    // 3. Calculate subtotal and verify stock
    let subtotal = 0;
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${item.product.name}`);
      }
      subtotal += Number(item.product.price) * item.quantity;
    }

    // 4. Validate and apply coupon if provided
    let discountAmount = 0;
    let couponId: string | null = null;
    if (data.couponCode) {
      const couponResult = await this.validateCoupon(data.couponCode, subtotal);
      discountAmount = couponResult.discountAmount;
      couponId = couponResult.couponId;
    }

    const totalAmount = subtotal - discountAmount;

    // 5. Create Order within Transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          totalAmount,
          addressId: data.addressId,
          shippingAddress: {
            title: address.title,
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            pincode: address.pincode,
            phone: address.phone,
          },
          couponId,
        },
      });

      // Create OrderItems
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        // Deduct Product Stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create Payment entry (Simulated COD or Pending)
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: totalAmount,
          method: 'COD', // Default to Cash On Delivery for prototype
          status: PaymentStatus.PENDING,
        },
      });

      // Clear User's Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
        coupon: true,
      },
    });
  }

  async createOrderDirect(userId: string, data: any) {
    // Direct checkout bypasses the database cart and address constraints.
    // data contains: items, totalAmount, shippingAddress, paymentMethod, paymentStatus
    
    const order = await this.prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          id: data.id, // we can optionally use the frontend generated ID
          userId,
          status: OrderStatus.PENDING,
          totalAmount: data.totalAmount,
          shippingAddress: data.shippingAddress,
        },
      });

      // Create OrderItems
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          // Verify product exists to prevent foreign key errors
          const product = await tx.product.findUnique({ where: { id: item.id } });
          if (product) {
            await tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                productId: product.id,
                quantity: item.quantity,
                price: item.price,
              },
            });
          }
        }
      }

      // Create Payment entry
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: data.totalAmount,
          method: data.paymentMethod || 'COD',
          status: data.paymentStatus === 'Paid' ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
        },
      });

      return newOrder;
    });

    return order;
  }

  async findAllUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneOrder(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
        payment: true,
        coupon: true,
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role !== 'ADMIN' && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  async trackOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Map backend OrderStatus to frontend Status
    let frontendStatus = 'Placed';
    if (order.status === 'PROCESSING') frontendStatus = 'Processing';
    if (order.status === 'SHIPPED') frontendStatus = 'Shipped';
    if (order.status === 'DELIVERED') frontendStatus = 'Delivered';

    // Map Payment Status
    const paymentStatus = order.payment?.status === 'SUCCESS' ? 'Paid' : 'Unpaid';

    // Build the frontend customer from shippingAddress JSON
    const sa: any = order.shippingAddress || {};
    const customer = {
      name: sa.name || 'Unknown',
      email: sa.email || 'N/A',
      phone: sa.phone || 'N/A',
      address: sa.address || 'N/A',
      city: sa.city || 'N/A',
      state: sa.state || 'N/A',
      pincode: sa.pincode || 'N/A',
    };

    const items = order.items.map(i => ({
      id: i.productId,
      name: i.product.name,
      price: Number(i.price),
      imageUrl: i.product.images?.[0]?.url || '',
      quantity: i.quantity,
      selectedFinish: 'Standard', // simplified
      selectedMaterial: 'Standard', // simplified
    }));

    return {
      id: order.id,
      date: order.createdAt.toISOString().split('T')[0],
      items,
      total: Number(order.totalAmount),
      status: frontendStatus,
      paymentStatus,
      paymentMethod: order.payment?.method || 'N/A',
      customer,
      placedAt: order.placedAt ? order.placedAt.toISOString() : order.createdAt.toISOString(),
      processingAt: order.processingAt ? order.processingAt.toISOString() : null,
      shippedAt: order.shippedAt ? order.shippedAt.toISOString() : null,
      deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : null,
      cancelledAt: order.cancelledAt ? order.cancelledAt.toISOString() : null,
    };
  }

  // --- Admin Order Operations ---
  async findAllOrdersAdmin() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatusAdmin(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Auto-update Payment Status to SUCCESS if status is set to DELIVERED
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const updateData: any = { status };

      if (status === OrderStatus.PENDING) {
        updateData.placedAt = now;
        updateData.processingAt = null;
        updateData.shippedAt = null;
        updateData.deliveredAt = null;
        updateData.cancelledAt = null;
      } else if (status === OrderStatus.PROCESSING) {
        updateData.processingAt = now;
        updateData.shippedAt = null;
        updateData.deliveredAt = null;
        updateData.cancelledAt = null;
      } else if (status === OrderStatus.SHIPPED) {
        updateData.shippedAt = now;
        updateData.deliveredAt = null;
        updateData.cancelledAt = null;
      } else if (status === OrderStatus.DELIVERED) {
        updateData.deliveredAt = now;
        updateData.cancelledAt = null;
      } else if (status === OrderStatus.CANCELLED) {
        updateData.cancelledAt = now;
      }

      const nextOrder = await tx.order.update({
        where: { id: orderId },
        data: updateData,
      });

      if (status === OrderStatus.DELIVERED) {
        await tx.payment.updateMany({
          where: { orderId },
          data: { status: PaymentStatus.SUCCESS },
        });
      }

      return nextOrder;
    });

    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
  }
}
