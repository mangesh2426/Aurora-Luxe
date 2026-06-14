import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressInput, UpdateAddressInput } from './address.schema';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateAddressInput) {
    if (data.isDefault) {
      // Set all other user addresses to not default
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        title: data.title,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        phone: data.phone,
        isDefault: data.isDefault ?? false,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new ForbiddenException('You do not have access to this address');
    }
    return address;
  }

  async update(id: string, userId: string, data: UpdateAddressInput) {
    await this.findOne(id, userId);

    if (data.isDefault) {
      // Set all other user addresses to not default
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: {
        title: data.title,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        phone: data.phone,
        isDefault: data.isDefault,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.address.delete({ where: { id } });
  }
}
