import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RedirectClient } from './decorators/redirect.decorator';
import { Session } from './decorators/session.decorator';
import { UserInfo } from './decorators/UserInfo.decorator';
import { SessionInfo } from './dto/session-info.dto';
import { AuthenticatedGuard } from './guard/auth.guard';
import { GithubGuard } from './guard/github.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(GithubGuard)
  login() {
    return;
  }

  // github 로그인이 성공적으로 완료되면 callback주소로 리다이렉트 됩니다.
  @Get('github/callback')
  @UseGuards(GithubGuard)
  callback(@RedirectClient() redirect) {
    return redirect;
  }

  // 로그인한 유저 정보를 반환합니다.
  @Version('1')
  @Get('userinfo')
  @ApiOperation({ summary: '유저 정보를 반환합니다.' })
  @UseGuards(AuthenticatedGuard)
  status(@UserInfo() userInfo: SessionInfo) {
    return userInfo;
  }

  // 로그인한 유저의 세션을 파기시킵니다.
  @Version('1')
  @Get('logout')
  @ApiOperation({ summary: '유저가 로그아웃을 합니다.' })
  @UseGuards(AuthenticatedGuard)
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
