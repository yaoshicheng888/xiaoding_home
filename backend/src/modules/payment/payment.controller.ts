import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from '../../common/decorators/public.decorator';

class CreatePaymentDto {
  orderId!: number;
}

class OrderIdQueryDto {
  orderId!: number;
}

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('pay/create')
  async create(@Body() body: CreatePaymentDto) {
    return this.paymentService.create(body.orderId);
  }

  @Public()
  @Post('pay/pay')
  async pay(@Body() body: CreatePaymentDto) {
    return this.paymentService.pay(body.orderId);
  }

  @Public()
  @Post('pay/settle')
  async settle(@Body() body: CreatePaymentDto) {
    return this.paymentService.settle(body.orderId);
  }

  @Public()
  @Post('pay/refund')
  async refund(@Body() body: CreatePaymentDto) {
    return this.paymentService.refund(body.orderId);
  }

  @Public()
  @Get('pay/detail')
  async detail(@Query() q: OrderIdQueryDto) {
    return this.paymentService.getByOrder(Number(q.orderId));
  }

  @Public()
  @Get('admin/payments')
  async list() {
    return this.paymentService.list();
  }

  @Public()
  @Post('pay/callback')
  async callback(@Body() body: any) {
    const { orderId, status } = body;
    if (status === 'success') {
      await this.paymentService.pay(orderId);
    }
    return { code: 0, message: 'success' };
  }
}
