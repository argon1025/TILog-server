import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import * as helmet from 'helmet';
import { HttpExceptionFilter } from './ExceptionFilters/HttpException.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationFailed } from './ExceptionFilters/Errors/Validation/Validation.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration Load
  const configService = app.get<ConfigService>(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT', null);
  const SERVER_ENV = configService.get<string>('NODE_ENV', 'product');
  const SERVER_HOST = configService.get<string>('SERVER_HOST', null);
  // CORS config
  const CORS_METHOD = configService.get<boolean>('CORS_METHOD', null);
  const CORS_ORIGIN = configService.get<boolean>('CORS_ORIGIN', null);
  const CORS_CREDENTIALS = configService.get<boolean>('CORS_CREDENTIALS', null);
  // Redis config
  const REDIS_HOST = configService.get<string>('REDIS_HOST', null);
  const REDIS_PORT = configService.get<string>('REDIS_PORT', null);
  //Session config
  const SESSION_COOKIE_MAXAGE = configService.get<string>('SESSION_COOKIE_MAXAGE', null);
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET', null);
  const SESSION_RESAVE = configService.get<boolean>('SESSION_RESAVE', null);
  const SESSION_SAVEUNINITIALIZED = configService.get<boolean>('SESSION_SAVEUNINITIALIZED', null);

  console.log(`test -> ${SERVER_PORT} ${REDIS_HOST} ${REDIS_PORT} ${SESSION_COOKIE_MAXAGE}`);

  //CORS Setting
  app.enableCors({
    origin: CORS_ORIGIN === ' true' ? true : false,
    methods: CORS_METHOD,
    credentials: CORS_CREDENTIALS === ' true' ? true : false,
  });

  // Connect Local Redis
  const client = redis.createClient({ url: `${REDIS_HOST}:${REDIS_PORT}` });
  // Redis Store Use Session
  const redisStore = connectRedis(session);
  // Redis Log
  client.on('connect', () => console.log('Redis Connect Success'));
  client.on('error', (error) => {
    throw new Error(error);
  });
  // Session Setting
  app.use(
    session({
      cookie: {
        maxAge: parseInt(SESSION_COOKIE_MAXAGE),
      },
      secret: SESSION_SECRET,
      resave: SESSION_RESAVE,
      saveUninitialized: SESSION_SAVEUNINITIALIZED,
      // 세션 스토어를 레지스로 설정합니다.
      store: new redisStore({ client }),
    }),
  );

  // Swagger
  const config = new DocumentBuilder().setTitle('TILog').setDescription('TILog API').setVersion('1.0.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Helmet
  app.use(helmet());

  // 패스포트를 구동합니다.
  app.use(passport.initialize());

  // 세션을 연결합니다.
  app.use(passport.session());

  // ExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());

  // ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(new ValidationFailed('test'));
      },
    }),
  );

  if (!SERVER_PORT || !SERVER_HOST) {
    Logger.error('Unable to load environment variables!');
    throw new Error('Unable to load environment variables!');
  } else {
    await app.listen(SERVER_PORT);
    Logger.log(`--------->>> ${SERVER_ENV}://${SERVER_HOST}:${SERVER_PORT} <<<---------`, 'SERVER_INFO');
    Logger.log(`--------->>> swagger path ${SERVER_ENV}://${SERVER_HOST}:${SERVER_PORT}/api <<<---------`, 'SERVER_INFO');
  }
}
bootstrap();
