import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BizException } from '../exceptions/biz.exception';

/**
 * 全局异常过滤器 - 统一错误返回格式
 * { code, message, data }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code = 500;
    let message = '系统错误';
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BizException) {
      code = exception.code;
      message = exception.message;
      httpStatus = HttpStatus.OK; // 业务错误统一200, 用code区分
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const resp = exception.getResponse();
      message =
        typeof resp === 'string'
          ? resp
          : (resp as Record<string, unknown>).message as string | string[] | undefined as unknown as string;
      if (Array.isArray(message)) message = message.join(';');
      code = httpStatus >= 500 ? 500 : 1;
      message = message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message || message;
      code = 500;
      this.logger.error(exception.stack);
    }

    response.status(httpStatus).json({
      code,
      message,
      data: null,
    });
  }
}
