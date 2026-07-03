import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [OrderModule],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
