import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import Error from './Interface/error.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorData = exception.getResponse() as Error;

    // Error Logging
    Logger.error(`
      code : ${errorData.codeNumber}
      location : ${request.url}
      errorCode : ${errorData.codeText}
      description : ${errorData.description || '개발자 코멘트가 존재하지 않습니다.'}
      message : ${errorData.message.en}
      message : ${errorData.message.kr || '한국어 에러 메시지가 정의되지 않았습니다.'}
      `);

    // Error response
    response.status(status).json({
      error: 'true',
      statusCode: status,
      timestamp: new Date().toISOString(),
      location: request.url,
      errorCode: errorData.codeText,
      message: errorData.message,
    });
  }
}
