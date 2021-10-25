import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()

//  Github Strategy에서 데이터 검증이 완료 된 후  super.login()메소드가 serializeUser를 호출하여 세션에 유저 정보를 저장 후 반환됩니다.
export class GithubGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    console.log('GithubGuard');
    return activate;
  }
}
