import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { bizError } from '../../common/exceptions/biz.exception';

const COMMISSION_RATE = 0.1;

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) bizError('订单不存在');

    const platformFee = Math.round(order.price * COMMISSION_RATE * 100) / 100;
    const providerIncome = Math.round((order.price - platformFee) * 100) / 100;

    return this.prisma.payment.create({
      data: {
        orderId,
        amount: order.price,
        platformFee,
        providerIncome,
        status: 'pending',
      },
    });
  }

  async pay(orderId: number) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) bizError('支付记录不存在');
    if (payment.status !== 'pending') bizError('支付状态异常');

    return this.prisma.payment.update({
      where: { orderId },
      data: { status: 'paid' },
    });
  }

  async settle(orderId: number) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) bizError('支付记录不存在');
    if (payment.status !== 'paid') bizError('支付未完成');

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order?.providerId) {
      await this.prisma.provider.update({
        where: { id: order.providerId },
        data: { balance: { increment: payment.providerIncome } },
      });
    }

    return this.prisma.payment.update({
      where: { orderId },
      data: { status: 'settled' },
    });
  }

  async refund(orderId: number) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) bizError('支付记录不存在');
    if (payment.status === 'refunded') bizError('已退款');

    return this.prisma.payment.update({
      where: { orderId },
      data: { status: 'refunded' },
    });
  }

  async getByOrder(orderId: number) {
    return this.prisma.payment.findUnique({ where: { orderId } });
  }

  async list() {
    return this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
  }
}
