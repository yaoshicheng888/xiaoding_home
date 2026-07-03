import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { bizError } from '../../common/exceptions/biz.exception';

@Injectable()
export class AfterSaleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(orderId: number, reason: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) bizError('订单不存在');
    if (order.status !== 'completed') bizError('订单未完成，无法申请售后');

    return this.prisma.afterSale.create({
      data: {
        orderId,
        reason,
        status: 'pending',
        freezeStatus: 'frozen',
      },
    });
  }

  async process(orderId: number) {
    const afterSale = await this.prisma.afterSale.findFirst({ where: { orderId } });
    if (!afterSale) bizError('售后记录不存在');
    if (afterSale.status !== 'pending') bizError('售后状态异常');

    return this.prisma.afterSale.update({
      where: { id: afterSale.id },
      data: { status: 'processing' },
    });
  }

  async resolve(orderId: number) {
    const afterSale = await this.prisma.afterSale.findFirst({ where: { orderId } });
    if (!afterSale) bizError('售后记录不存在');
    if (afterSale.status !== 'processing') bizError('售后状态异常');

    return this.prisma.afterSale.update({
      where: { id: afterSale.id },
      data: { status: 'resolved', freezeStatus: 'unfrozen' },
    });
  }

  async reject(orderId: number) {
    const afterSale = await this.prisma.afterSale.findFirst({ where: { orderId } });
    if (!afterSale) bizError('售后记录不存在');
    if (afterSale.status !== 'pending') bizError('售后状态异常');

    return this.prisma.afterSale.update({
      where: { id: afterSale.id },
      data: { status: 'rejected', freezeStatus: 'unfrozen' },
    });
  }

  async getByOrder(orderId: number) {
    return this.prisma.afterSale.findFirst({ where: { orderId } });
  }

  async list() {
    return this.prisma.afterSale.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
  }
}
