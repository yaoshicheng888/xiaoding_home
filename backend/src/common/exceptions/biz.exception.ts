/**
 * 统一业务异常
 * code: 0=成功 1=业务错误 500=系统错误
 */
export class BizException extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'BizException';
  }
}

export function bizError(message: string, code = 1, data?: unknown): never {
  throw new BizException(code, message, data);
}
