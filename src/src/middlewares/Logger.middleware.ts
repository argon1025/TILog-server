import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    // request Processing Time
    const START_TIME = Date.now();
    // NodeJS
    const { ip, method, originalUrl } = request;
    // get userAgent
    const userAgent = request.get('user-agent') || '';

    // Response finish event
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(`${Date.now() - START_TIME}ms - ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    });

    next();
  }
}