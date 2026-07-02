import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  logger.log(`🚀 小钉到家后端已启动: http://localhost:${port}/api`);
  logger.log(`   AI解析: POST /api/ai/parse`);
  logger.log(`   用户登录: POST /api/user/login`);
  logger.log(`   师傅登录: POST /api/provider/login`);
  logger.log(`   状态流转: created -> assigned -> accepted -> doing -> completed`);
}

bootstrap();
