import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  health() {
    return {
      name: '小钉到家后端服务',
      version: '1.0.0-mvp',
      status: 'running',
      docs: {
        ai: 'POST /api/ai/parse',
        userLogin: 'POST /api/user/login',
        userInfo: 'GET /api/user/info',
        createRequest: 'POST /api/request/create',
        createOrder: 'POST /api/order/create',
        orderList: 'GET /api/order/list',
        orderDetail: 'GET /api/order/detail',
        providerLogin: 'POST /api/provider/login',
        providerOrders: 'GET /api/provider/orders',
        providerTake: 'POST /api/provider/take',
        providerStart: 'POST /api/provider/start',
        providerComplete: 'POST /api/provider/complete',
        adminDispatchAuto: 'POST /api/admin/dispatch/auto',
        adminDispatchManual: 'POST /api/admin/dispatch/manual',
      },
    };
  }
}
