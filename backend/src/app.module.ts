import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

import { AiModule } from './modules/ai/ai.module';
import { UserModule } from './modules/user/user.module';
import { ProviderModule } from './modules/provider/provider.module';
import { OrderModule } from './modules/order/order.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AfterSaleModule } from './modules/aftersale/aftersale.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'xiaoding-mvp-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' },
    }),
    PrismaModule,
    AiModule,
    UserModule,
    OrderModule,
    DispatchModule,
    ProviderModule,
    AdminModule,
    PaymentModule,
    AfterSaleModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
