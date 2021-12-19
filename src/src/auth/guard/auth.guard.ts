import { CanActivate, ExecutionContext, HttpException, Injectable, Logger } from '@nestjs/common';
import { FailedAuthentication } from 'src/ExceptionFilters/Errors/Auth/Auth.error';

// 인증 유무를 반환합니다
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    Logger.log('AuthenticatedGuard');
    if (!req.isAuthenticated()) {
      const errorResponse = new FailedAuthentication(`auth.guard.authentication.failedauthentication`);
      throw new HttpException(errorResponse, errorResponse.codeNumber);
    }
    return req.isAuthenticated();
  }
}
