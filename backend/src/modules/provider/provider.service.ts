import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { bizError } from '../../common/exceptions/biz.exception';

@Injectable()
export class ProviderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * 师傅登录(MVP): 手机号一键登录
   */
  async login(phone: string): Promise<{ token: string; provider: { id: number; phone: string; name: string } }> {
    if (!phone || !/^1\d{10}$/.test(phone)) {
      bizError('手机号格式不正确');
    }

    let provider = await this.prisma.provider.findUnique({ where: { phone } });
    if (!provider) {
      provider = await this.prisma.provider.create({
        data: { phone, name: '师傅' + phone.slice(-4) },
      });
    }

    const token = await this.jwt.signAsync({
      id: provider.id,
      role: 'provider',
      phone: provider.phone,
    });

    return { token, provider: { id: provider.id, phone: provider.phone, name: provider.name } };
  }

  /**
   * 抢单列表: 返回
   *   1) 公开池中 status=created 的订单(任何师傅可抢)
   *   2) 已派给当前师傅 status=assigned 的订单
   */
  async listAvailableOrders(providerId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { status: 'created' },
          { status: 'assigned', providerId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, phone: true, city: true } },
        request: true,
      },
    });

    return orders.map((o) => ({
      id: o.id,
      status: o.status,
      category: o.category,
      description: o.description,
      price: o.price,
      createdAt: o.createdAt,
      user: o.user,
      problem: o.request?.aiProblem,
    }));
  }

  async listMyOrders(providerId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        providerId,
        status: { notIn: ['created'] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, phone: true, city: true } },
        request: true,
        payment: true,
      },
    });

    return orders.map((o) => ({
      id: o.id,
      status: o.status,
      category: o.category,
      description: o.description,
      price: o.price,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      user: o.user,
      problem: o.request?.aiProblem,
      paymentStatus: o.payment?.status,
    }));
  }

  async getIncome(providerId: number) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });

    const payments = await this.prisma.payment.findMany({
      where: {
        order: { providerId },
      },
      include: { order: true },
    });

    const totalIncome = payments.reduce((sum, p) => sum + p.providerIncome, 0);
    const settledIncome = payments
      .filter((p) => p.status === 'settled')
      .reduce((sum, p) => sum + p.providerIncome, 0);
    const pendingIncome = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.providerIncome, 0);

    return {
      balance: provider?.balance || 0,
      totalIncome,
      settledIncome,
      pendingIncome,
    };
  }

  async getStats(providerId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await this.prisma.order.count({
      where: {
        providerId,
        createdAt: { gte: today },
      },
    });

    const todayIncome = await this.prisma.payment.aggregate({
      _sum: { providerIncome: true },
      where: {
        order: { providerId, createdAt: { gte: today } },
      },
    });

    const pendingOrders = await this.prisma.order.count({
      where: {
        providerId,
        status: { in: ['accepted', 'doing'] },
      },
    });

    return {
      todayOrders,
      todayIncome: todayIncome._sum.providerIncome || 0,
      pendingOrders,
    };
  }
}
