import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { Public } from '../../common/decorators/public.decorator';

class AutoDispatchDto {
  orderId!: number;
}

class ManualDispatchDto {
  orderId!: number;
  providerId!: number;
}

class OrderIdQueryDto {
  orderId!: number;
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dispatchService: DispatchService,
  ) {}

  @Public()
  @Get('orders')
  async orders(@Query() q?: OrderIdQueryDto) {
    if (q?.orderId) {
      return this.prisma.order.findUnique({
        where: { id: q.orderId },
        include: {
          user: { select: { id: true, name: true, phone: true, city: true } },
          provider: { select: { id: true, name: true, phone: true, rating: true } },
          request: true,
        },
      });
    }
    
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, phone: true, city: true } },
        provider: { select: { id: true, name: true, phone: true, rating: true } },
        request: true,
      },
    });
  }

  @Public()
  @Get('providers')
  async providers() {
    return this.prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Public()
  @Post('dispatch/auto')
  async autoDispatch(@Body() body: AutoDispatchDto) {
    return this.dispatchService.autoDispatch(body.orderId);
  }

  @Public()
  @Post('dispatch/manual')
  async manualDispatch(@Body() body: ManualDispatchDto) {
    return this.dispatchService.manualDispatch(body.orderId, body.providerId);
  }

  @Public()
  @Get('orders/:orderId/logs')
  async orderLogs(@Param('orderId') orderId: number) {
    return this.prisma.orderStatusLog.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }

  @Public()
  @Get('stats')
  async stats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await this.prisma.order.count({
      where: { createdAt: { gte: today } },
    });

    const todayRevenue = await this.prisma.order.aggregate({
      _sum: { price: true },
      where: { createdAt: { gte: today } },
    });

    const pendingOrders = await this.prisma.order.count({
      where: { status: { in: ['created', 'assigned', 'accepted', 'doing'] } },
    });

    const onlineProviders = await this.prisma.provider.count({
      where: { status: 'online' },
    });

    const completedOrders = await this.prisma.order.count({
      where: { status: 'completed' },
    });

    return {
      todayOrders,
      todayRevenue: todayRevenue._sum.price || 0,
      pendingOrders,
      onlineProviders,
      completedOrders,
    };
  }

  @Public()
  @Get('users')
  async users() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, phone: true, name: true, createdAt: true },
    });
  }
}
