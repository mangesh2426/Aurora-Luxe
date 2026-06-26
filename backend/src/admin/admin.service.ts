import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Total revenue (sum of all paid orders, or non-cancelled orders)
    const orders = await this.prisma.order.findMany({
      include: { payment: true },
    });
    
    const revenue = orders.reduce((sum, order) => {
      // Sum up if payment succeeded or order is not cancelled
      if (order.status !== 'CANCELLED') {
        return sum + Number(order.totalAmount);
      }
      return sum;
    }, 0);

    // Calculations for today's orders
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const ordersToday = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const pendingOrders = await this.prisma.order.count({
      where: { status: 'PENDING' },
    });

    const deliveredOrders = await this.prisma.order.count({
      where: { status: 'DELIVERED' },
    });

    const cancelledOrders = await this.prisma.order.count({
      where: { status: 'CANCELLED' },
    });

    // 2. Orders count
    const ordersCount = orders.length;

    // 3. Customers count (total registered users)
    const usersCount = await this.prisma.user.count({
      where: { role: Role.USER },
    });

    // 4. Products inventory stats
    const totalProducts = await this.prisma.product.count();
    const outOfStockProducts = await this.prisma.product.count({
      where: { stock: 0 },
    });
    const lowStockProducts = await this.prisma.product.count({
      where: {
        stock: {
          gt: 0,
          lte: 10,
        },
      },
    });
    const allProducts = await this.prisma.product.findMany({ select: { stock: true } });
    const liveInventory = allProducts.reduce((sum, p) => sum + p.stock, 0);

    // 5. Recent transactions log (last 10 orders)
    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
        payment: true,
      },
    });

    const latestOrder = await this.prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    return {
      revenue,
      ordersCount,
      ordersToday,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      usersCount,
      totalProducts,
      outOfStockProducts,
      lowStockProducts,
      liveInventory,
      recentOrders,
      latestOrderTime: latestOrder?.createdAt || null,
      lastUpdated: new Date(),
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        orders: {
          where: { status: { not: 'CANCELLED' } },
        },
        addresses: {
          where: { isDefault: true },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      phone: user.addresses[0]?.phone || 'N/A',
      address: user.addresses[0] ? `${user.addresses[0].city}, ${user.addresses[0].country}` : 'N/A',
      totalSpent: user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
    }));
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
