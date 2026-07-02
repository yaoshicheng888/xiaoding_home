import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

class CreateRequestDto {
  text!: string;
}

class CreateOrderDto {
  requestId!: number;
}

class OrderIdQueryDto {
  orderId!: number;
}

/**
 * 订单相关接口(用户端入口)
 * - POST /api/request/create  创建AI解析请求
 * - POST /api/order/create    创建订单
 * - GET  /api/order/list      用户订单列表
 * - GET  /api/order/detail    订单详情
 */
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ============ AI解析请求 ============
  @Post('request/create')
  async createRequest(
    @CurrentUser() u: CurrentUserPayload,
    @Body() body: CreateRequestDto,
  ) {
    return this.orderService.createRequest(u.id, body.text);
  }

  // ============ 订单 ============
  @Post('order/create')
  async createOrder(
    @CurrentUser() u: CurrentUserPayload,
    @Body() body: CreateOrderDto,
  ) {
    return this.orderService.createOrder(u.id, body.requestId);
  }

  @Get('order/list')
  async list(@CurrentUser() u: CurrentUserPayload) {
    return this.orderService.listByUser(u.id);
  }

  @Get('order/detail')
  async detail(@Query() q: OrderIdQueryDto) {
    return this.orderService.detail(Number(q.orderId));
  }
}
