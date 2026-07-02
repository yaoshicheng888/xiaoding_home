import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

class LoginDto {
  phone!: string;
}

class OrderIdDto {
  orderId!: number;
  remark?: string;
  images?: string[];
}

/**
 * 师傅端 API
 * - POST /api/provider/login     登录
 * - GET  /api/provider/orders    抢单列表
 * - POST /api/provider/take      抢单
 * - POST /api/provider/start     开始服务
 * - POST /api/provider/complete  完工提交
 */
@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService,
    private readonly dispatchService: DispatchService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.providerService.login(body.phone);
  }

  @Get('orders')
  async orders(@CurrentUser() p: CurrentUserPayload) {
    return this.providerService.listAvailableOrders(p.id);
  }

  @Get('my-orders')
  async myOrders(@CurrentUser() p: CurrentUserPayload) {
    return this.providerService.listMyOrders(p.id);
  }

  @Get('income')
  async income(@CurrentUser() p: CurrentUserPayload) {
    return this.providerService.getIncome(p.id);
  }

  @Get('stats')
  async stats(@CurrentUser() p: CurrentUserPayload) {
    return this.providerService.getStats(p.id);
  }

  @Post('take')
  async take(@CurrentUser() p: CurrentUserPayload, @Body() body: OrderIdDto) {
    return this.dispatchService.takeOrder(p.id, body.orderId);
  }

  @Post('start')
  async start(@CurrentUser() p: CurrentUserPayload, @Body() body: OrderIdDto) {
    return this.dispatchService.startService(p.id, body.orderId);
  }

  @Post('complete')
  async complete(@CurrentUser() p: CurrentUserPayload, @Body() body: OrderIdDto) {
    return this.dispatchService.completeService(p.id, body.orderId, body.remark, body.images);
  }
}
