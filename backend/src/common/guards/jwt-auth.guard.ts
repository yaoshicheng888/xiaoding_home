import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { bizError } from '../exceptions/biz.exception';

/**
 * 简单 JWT 守卫
 * MVP阶段: header 携带 Authorization: Bearer xxx
 * 若 token 缺失, 业务接口会拒绝; 但 Public 接口放行.
 * 为了便于联调, 当无 token 时如果接口不是 Public, 直接抛业务错误.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger('JwtAuthGuard');

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;

    if (isPublic) return true;

    if (!auth || !auth.startsWith('Bearer ')) {
      bizError('未登录(token缺失)', 1);
    }

    const token = auth!.slice(7);
    try {
      const payload = await this.jwtService.verifyAsync<{
        id: number;
        role: string;
        phone: string;
      }>(token);
      req.user = payload;
      return true;
    } catch (e) {
      bizError('token无效或已过期', 1);
    }
  }
}
