import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { DispatchModule } from '../dispatch/dispatch.module';

@Module({
  imports: [PrismaModule, DispatchModule],
  controllers: [AdminController],
})
export class AdminModule {}
