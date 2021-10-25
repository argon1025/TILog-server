import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// 인증 유무를 반환합니다
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('AuthenticatedGuard');
    return req.isAuthenticated();
  }
}
