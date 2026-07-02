import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AfterSaleService } from './aftersale.service';

class CreateAfterSaleDto {
  orderId!: number;
  reason!: string;
}

class OrderIdQueryDto {
  orderId!: number;
}

@Controller()
export class AfterSaleController {
  constructor(private readonly afterSaleService: AfterSaleService) {}

  @Post('aftersale/create')
  async create(@Body() body: CreateAfterSaleDto) {
    return this.afterSaleService.create(body.orderId, body.reason);
  }

  @Post('aftersale/process')
  async process(@Body() body: OrderIdQueryDto) {
    return this.afterSaleService.process(body.orderId);
  }

  @Post('aftersale/resolve')
  async resolve(@Body() body: OrderIdQueryDto) {
    return this.afterSaleService.resolve(body.orderId);
  }

  @Post('aftersale/reject')
  async reject(@Body() body: OrderIdQueryDto) {
    return this.afterSaleService.reject(body.orderId);
  }

  @Get('aftersale/detail')
  async detail(@Query() q: OrderIdQueryDto) {
    return this.afterSaleService.getByOrder(q.orderId);
  }

  @Get('admin/aftersales')
  async list() {
    return this.afterSaleService.list();
  }
}
