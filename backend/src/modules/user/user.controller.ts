import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

class LoginDto {
  phone!: string;
}

/**
 * 用户端 API
 * - POST /api/user/login  手机号登录
 * - GET  /api/user/info   用户信息
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body.phone);
  }

  @Get('info')
  async info(@CurrentUser() u: CurrentUserPayload) {
    return this.userService.getInfo(u.id);
  }
}
