import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { bizError } from '../../common/exceptions/biz.exception';
import { OrderStatus } from '@prisma/client';

// 各类目基础定价(MVP固定, 后续可由后端规则引擎/师傅报价替代)
const CATEGORY_PRICE: Record<string, number> = {
  空调维修: 120,
  疏通: 150,
  水管维修: 100,
  电路维修: 120,
  家电维修: 100,
  开锁: 80,
  通用: 90,
};

// 平台抽佣比例
const COMMISSION_RATE = 0.1;

// 合法状态流转
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  created: ['assigned', 'accepted'],
  assigned: ['accepted'],
  accepted: ['doing'],
  doing: ['completed'],
  completed: [],
};

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  /**
   * 创建 AI 解析请求
   * 用户输入文本 -> AI 解析 -> 存 service_request
   * 返回 request_id + ai_result
   */
  async createRequest(userId: number, text: string) {
    const parsed = this.ai.parse(text);

    const req = await this.prisma.serviceRequest.create({
      data: {
        userId,
        rawText: text,
        aiCategory: parsed.category,
        aiProblem: parsed.problem,
        aiUrgency: parsed.urgency,
        aiResult: parsed as unknown as object,
      },
    });

    return {
      requestId: req.id,
      aiResult: parsed,
    };
  }

  /**
   * 创建订单 (基于 request_id)
   * 价格由后端按类目计算, 严禁前端传入
   */
  async createOrder(userId: number, requestId: number) {
    const req = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });
    if (!req) bizError('AI解析单不存在');
    if (req.userId !== userId) bizError('无权操作该需求单');

    const category = req.aiCategory ?? '通用';
    const price = CATEGORY_PRICE[category] ?? CATEGORY_PRICE['通用'];
    const commission = Math.round(price * COMMISSION_RATE * 100) / 100;

    const order = await this.prisma.order.create({
      data: {
        requestId,
        userId,
        status: 'created',
        category,
        description: req.rawText,
        price,
        commission,
      },
    });

    return { orderId: order.id };
  }

  /**
   * 用户订单列表
   */
  async listByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        provider: { select: { id: true, name: true, phone: true, rating: true } },
      },
    });
  }

  /**
   * 订单详情
   */
  async detail(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, phone: true, city: true } },
        provider: { select: { id: true, name: true, phone: true, rating: true } },
        request: true,
      },
    });
    if (!order) bizError('订单不存在');
    return order;
  }

  /**
   * 状态流转 (供派单/师傅端调用)
   * 校验当前状态 -> 目标状态是否合法, 然后更新
   */
  async transition(
    orderId: number,
    next: OrderStatus,
    providerId?: number,
    operator: string = 'system',
    remark?: string,
  ): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) bizError('订单不存在');

    const allowed = TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(next)) {
      bizError(
        `订单状态非法流转: ${order.status} -> ${next} (合法目标: ${allowed.join(',') || '无'})`,
      );
    }

    const fromStatus = order.status;

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: next,
          ...(providerId !== undefined ? { providerId } : {}),
        },
      }),
      this.prisma.orderStatusLog.create({
        data: {
          orderId,
          fromStatus,
          toStatus: next,
          operator,
          remark,
        },
      }),
    ]);
  }
}
