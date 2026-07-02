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
}
