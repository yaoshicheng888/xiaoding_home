import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 统一成功响应拦截器
 * 把 controller 返回值包装成: { code: 0, message: 'success', data }
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, unknown>
{
  intercept(_ctx: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(
      map((data) => ({
        code: 0,
        message: 'success',
        data: data ?? null,
      })),
    );
  }
}
