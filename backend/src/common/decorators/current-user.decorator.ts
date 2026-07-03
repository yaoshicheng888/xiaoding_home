import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  id: number;
  role: 'user' | 'provider';
  phone: string;
}

/**
 * 从 request.user 取出当前登录用户/师傅
 * 用法: doSomething(@CurrentUser() u: CurrentUserPayload)
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as CurrentUserPayload;
  },
);
