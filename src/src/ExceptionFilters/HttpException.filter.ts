import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import Error from './Interface/Error.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    // 요청
    const request = ctx.getRequest<Request>();

    // 응답
    const response = ctx.getResponse<Response>();

    // 사용자 정의된 에러 객체
    const errorData = exception.getResponse() as Error | any;

    // Error Mapping
    const status = exception.getStatus();
    const requestLocation = request.url;
    const errorObjectCode = !errorData?.codeText ? errorData.error : errorData.codeText;
    const devDescription = !errorData?.description ? 'not found error description' : errorData.description;
    const message = !errorData?.message ? errorData : errorData.message;

    // Logging
    Logger.error(`
      statusCode : ${status}
      location : ${requestLocation}
      errorObjectCode : ${errorObjectCode}
      description : ${devDescription}
      message : ${JSON.stringify(message)}
      `);

    // Error response
    response.status(status).json({
      error: true,
      statusCode: status,
      timestamp: new Date().toISOString(),
      location: requestLocation,
      errorCode: errorObjectCode,
      message: message,
    });
  }
}
