import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderService } from '../order/order.service';
import { bizError } from '../../common/exceptions/biz.exception';

@Injectable()
export class DispatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  /**
   * 自动派单 (MVP简化版规则):
   * 1) 取该订单类目对应的在线师傅(skill_tags 包含类目关键字 或 全部在线师傅)
   * 2) 取评分最高 + 余额最低优先 (简单规则)
   * 3) 创建 Job(type=auto) 并把订单状态置为 assigned
   *
   * 若无在线师傅, 订单保持 created 待人工派单.
   */
  async autoDispatch(orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) bizError('订单不存在');
    if (order!.status !== 'created') {
      bizError(`订单当前状态为 ${order!.status}, 无法自动派单`);
    }

    const onlineProviders = await this.prisma.provider.findMany({
      where: { status: 'online' },
    });

    if (onlineProviders.length === 0) {
      bizError('暂无在线师傅, 请稍后重试或手动派单');
    }

    // 简单匹配: 优先 skill_tags 包含类目关键字的师傅, 否则随机一位在线师傅
    const category = order!.category ?? '';
    const matched = onlineProviders.filter((p) =>
      p.skillTags.includes(category.replace('维修', '').replace('维修', '')) ||
      p.skillTags.includes(category),
    );
    const pool = matched.length > 0 ? matched : onlineProviders;

    // 评分降序 -> 取首位
    pool.sort((a, b) => Number(b.rating) - Number(a.rating));
    const picked = pool[0]!;

    await this.prisma.$transaction([
      this.prisma.job.create({
        data: {
          orderId,
          providerId: picked.id,
          type: 'auto',
          status: 'pending',
        },
      }),
    ]);

    await this.orderService.transition(orderId, 'assigned', picked.id);

    return { orderId, providerId: picked.id, providerName: picked.name };
  }

  /**
   * 手动派单: 指定师傅
   */
  async manualDispatch(orderId: number, providerId: number) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });
    if (!provider) bizError('师傅不存在');

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) bizError('订单不存在');
    if (order!.status !== 'created' && order!.status !== 'assigned') {
      bizError(`订单当前状态为 ${order!.status}, 无法派单`);
    }

    // 若已有旧 job, 删掉重建
    await this.prisma.job.deleteMany({ where: { orderId } });
    await this.prisma.job.create({
      data: {
        orderId,
        providerId,
        type: 'manual',
        status: 'pending',
      },
    });

    await this.orderService.transition(orderId, 'assigned', providerId);

    return { orderId, providerId, providerName: provider!.name };
  }

  /**
   * 师傅接单(抢单):
   *   - 订单 status=created (公开池) -> 任意师傅可接, 直接置 accepted
   *   - 订单 status=assigned -> 必须是指定师傅本人才能接
   */
  async takeOrder(providerId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) bizError('订单不存在');

    if (order!.status === 'created') {
      // 公开抢: 创建/更新 job, 状态置 accepted
      await this.prisma.job.upsert({
        where: { orderId },
        update: { providerId, status: 'taken' },
        create: { orderId, providerId, type: 'auto', status: 'taken' },
      });
      await this.orderService.transition(orderId, 'accepted', providerId);
    } else if (order!.status === 'assigned') {
      if (order!.providerId !== providerId) {
        bizError('该订单已派给其他师傅, 无权接单');
      }
      await this.prisma.job.updateMany({
        where: { orderId },
        data: { status: 'taken' },
      });
      await this.orderService.transition(orderId, 'accepted', providerId);
    } else {
      bizError(`订单当前状态为 ${order!.status}, 无法接单`);
    }

    return { orderId, status: 'accepted' };
  }

  /**
   * 开始服务: accepted -> doing
   */
  async startService(providerId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) bizError('订单不存在');
    if (order!.providerId !== providerId) bizError('无权操作该订单');
    if (order!.status !== 'accepted') {
      bizError(`订单当前状态为 ${order!.status}, 无法开始服务`);
    }

    await this.prisma.provider.update({
      where: { id: providerId },
      data: { status: 'busy' },
    });

    await this.orderService.transition(orderId, 'doing');
    return { orderId, status: 'doing' };
  }

  /**
   * 完工提交: doing -> completed
   * - 师傅变回 online
   * - 记录图片/备注 (MVP 仅存 JSON, 不上传OSS)
   */
  async completeService(
    providerId: number,
    orderId: number,
    remark?: string,
    images?: string[],
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) bizError('订单不存在');
    if (order!.providerId !== providerId) bizError('无权操作该订单');
    if (order!.status !== 'doing') {
      bizError(`订单当前状态为 ${order!.status}, 无法完工`);
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        remark: remark ?? null,
        images: images && images.length > 0 ? (images as unknown as object) : undefined,
      },
    });

    await this.orderService.transition(orderId, 'completed');

    await this.prisma.provider.update({
      where: { id: providerId },
      data: { status: 'online' },
    });

    return { orderId, status: 'completed' };
  }
}
