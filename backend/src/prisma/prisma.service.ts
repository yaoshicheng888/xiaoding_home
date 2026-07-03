import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 全局服务
 * 懒连接: 即使数据库未启动, NestJS也能启动; 真正查询时才会报错.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('Prisma');

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma 已连接数据库');
    } catch (err) {
      this.logger.warn(
        '⚠️  数据库连接失败(后端仍会启动, 但DB操作将不可用): ' + (err as Error).message,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
