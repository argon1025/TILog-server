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
  const client = redis.createClient({ url: 'redis://127.0.0.1:6379' });
  const RedisStore = connectRedis(session);
  client.on('connect', () => console.log('conecct'));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(
    session({
      cookie: {
        maxAge: 10000 * 24, // 2시간
      },
      secret: 'bitcoin-is-doog',
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client }),
    }),
  );
  app.use(passport.initialize());
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
