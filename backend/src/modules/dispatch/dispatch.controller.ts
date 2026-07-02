import { Body, Controller, Post } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { Public } from '../../common/decorators/public.decorator';

class AutoDispatchDto {
  orderId!: number;
}

class ManualDispatchDto {
  orderId!: number;
  providerId!: number;
}

/**
 * 派单系统 (后台)
 * MVP 阶段两个接口公开, 便于联调; 真实部署应加 admin 守卫
 * - POST /api/admin/dispatch/auto    自动派单
 * - POST /api/admin/dispatch/manual  手动派单
 */
@Controller('admin/dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Public()
  @Post('auto')
  async auto(@Body() body: AutoDispatchDto) {
    return this.dispatchService.autoDispatch(body.orderId);
  }

  @Public()
  @Post('manual')
  async manual(@Body() body: ManualDispatchDto) {
    return this.dispatchService.manualDispatch(body.orderId, body.providerId);
  }
}
