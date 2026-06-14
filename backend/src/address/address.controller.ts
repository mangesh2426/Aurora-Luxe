import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createAddressSchema, updateAddressSchema } from './address.schema';
import type { CreateAddressInput, UpdateAddressInput } from './address.schema';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Req() req: any, @Body(new ZodValidationPipe(createAddressSchema)) createAddressDto: CreateAddressInput) {
    const userId = req.user.userId;
    const address = await this.addressService.create(userId, createAddressDto);
    return { success: true, message: 'Address created successfully', data: address };
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    const addresses = await this.addressService.findAll(userId);
    return { success: true, count: addresses.length, data: addresses };
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    const address = await this.addressService.findOne(id, userId);
    return { success: true, data: address };
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAddressSchema)) updateAddressDto: UpdateAddressInput,
  ) {
    const userId = req.user.userId;
    const address = await this.addressService.update(id, userId, updateAddressDto);
    return { success: true, message: 'Address updated successfully', data: address };
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.addressService.delete(id, userId);
    return { success: true, message: 'Address deleted successfully' };
  }
}
