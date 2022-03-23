import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const transaction = Sentry.startTransaction({
        op: 'request',
        name: req.url,
      });
      Sentry.getCurrentHub().configureScope((scope) => {
        scope.addEventProcessor((event) => {
          event.request = {
            method: req.method,
            url: req.url,
          };
          return event;
        });
      });
      Sentry.configureScope((scope) => {
        scope.setSpan(transaction);
      });
      if (transaction) {
        console.log('트랜젝션 발생!', transaction);
        req.on('close', () => {
          transaction.setHttpStatus(res.statusCode);
          transaction.finish();
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
