import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserInfo } from '../dto/userinfo.dto';
import Time from '../../utilities/time.utility';
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['profile'],
    });
  }
  // 유저의 자격증명이 완료되면 유저의 정보를 받고, 유저 데이터를 검증 후 반환합니다.
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    Logger.log('Callback');
    const { nodeId, username, photos, provider } = profile;
    const userinfo: UserInfo = {
      oAuthServiceId: nodeId,
      userName: username,
      proFileImageUrl: photos[0].value,
      oAuthType: provider,
      accessToken: accessToken,
      createdAt: Time.nowDate(),
    };
    return await this.authService.validateUser(userinfo);
  }
}
