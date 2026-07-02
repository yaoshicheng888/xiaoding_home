import { Module } from '@nestjs/common';
import { AfterSaleController } from './aftersale.controller';
import { AfterSaleService } from './aftersale.service';

@Module({
  controllers: [AfterSaleController],
  providers: [AfterSaleService],
  exports: [AfterSaleService],
})
export class AfterSaleModule {}
