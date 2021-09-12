import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration Load
  const configService = app.get<ConfigService>(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT', null);
  const SERVER_ENV = configService.get<string>('NODE_ENV', 'product');
  const SERVER_HOST = configService.get<string>('SERVER_HOST', null);
  //CORS Setting
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Redis Setting
  // Connect Local Redis
  const client = redis.createClient({ url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
  // Redis Store Use Session
  const redisStore = connectRedis(session);
  // Redis Log
  client.on('connect', () => console.log('Redis Connect Success'));
  client.on('error', (error) => console.log('Redis Connect error:' + error));

  // Session Setting
  app.use(
    session({
      cookie: {
        maxAge: 10000 * 24, // 24H
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // 세션 스토어를 레지스로 설정합니다.
      store: new redisStore({ client }),
    }),
  );

  // Passport Setting
  // 패스포트를 구동합니다.
  app.use(passport.initialize());
  // 세션을 연결합니다.
  app.use(passport.session());

  if (!SERVER_PORT || !SERVER_HOST) {
    Logger.error('Unable to load environment variables!');
    throw new Error('Unable to load environment variables!');
  } else {
    await app.listen(SERVER_PORT);
    Logger.log(`--------->>> ${SERVER_ENV}://${SERVER_HOST}:${SERVER_PORT} <<<---------`, 'SERVER_INFO');
  }
}
bootstrap();
