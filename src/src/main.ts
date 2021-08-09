import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration Load
  const configService = app.get<ConfigService>(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT', null);
  const SERVER_ENV = configService.get<string>('NODE_ENV', null);
  const SERVER_HOST = configService.get<string>('SERVER_HOST', null);

  if (!SERVER_ENV || !SERVER_PORT || !SERVER_HOST) {
    Logger.error('Unable to load environment variables!');
    throw new Error('Unable to load environment variables!');
  } else {
    await app.listen(SERVER_PORT);
    Logger.log(`--------->>> ${SERVER_ENV}://${SERVER_HOST}:${SERVER_PORT} <<<---------`, 'SERVER_INFO');
  }
}
bootstrap();
