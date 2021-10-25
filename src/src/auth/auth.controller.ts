import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Session } from './decorators/session.decorator';
import { UserStats } from './decorators/userStats.decorator';
import { AuthenticatedGuard } from './guard/auth.guard';
import { GithubGuard } from './guard/github.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // github 로그인을 요청합니다.
  @Get('github')
  @UseGuards(GithubGuard)
  login() {
    return;
  }

  // github 로그인이 성공적으로 완료되면 callback주소로 리다이렉트 됩니다.
  @Get('github/callback')
  @UseGuards(GithubGuard)
  @Redirect(process.env.REDIRECT_FRONT)
  callback() {
    return;
  }

  // 로그인한 유저 정보를 반환합니다.
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@UserStats() userStats) {
    return userStats;
  }

  // 로그인한 유저의 세션을 파기시킵니다.
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  @Redirect(process.env.REDIRECT_FRONT)
  logout(@Session() session) {
    // 세션을 제거합니다.
    session.destroy((error) => {
      if (error) {
        return console.log(error);
      }
      return;
    });
  }
}
