import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import * as Sentry from '@sentry/node';

export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    const userInfo = res.req.user;
    return next.handle().pipe(
      catchError((error) => {
        if (error.status === 404) return throwError(() => error);
        Sentry.withScope((scope) => {
          scope.setExtra('error massage', error.response);
          scope.setUser({
            id: userInfo.id,
            username: userInfo.userName,
            profile: userInfo.proFileImageUrl,
          });
          Sentry.captureException(error);
        });
        return throwError(() => error);
      }),
    );
  }
}
