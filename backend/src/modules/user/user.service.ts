import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { bizError } from '../../common/exceptions/biz.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * 用户登录(MVP): 手机号一键登录, 不存在则自动注册
   */
  async login(phone: string): Promise<{ token: string; user: { id: number; phone: string } }> {
    if (!phone || !/^1\d{10}$/.test(phone)) {
      bizError('手机号格式不正确');
    }

    const user = await this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone },
    });

    const token = await this.jwt.signAsync({
      id: user.id,
      role: 'user',
      phone: user.phone,
    });

    return { token, user: { id: user.id, phone: user.phone } };
  }

  async getInfo(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) bizError('用户不存在');
    const { id, phone, name, avatar, city } = user!;
    return { id, phone, name, avatar, city };
  }
}
