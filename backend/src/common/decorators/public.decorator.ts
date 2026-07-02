import { SetMetadata } from '@nestjs/common';

/**
 * 标记该接口不需要登录(在 MVP 中默认大部分接口走宽松模式)
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): MethodDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true) as MethodDecorator;
