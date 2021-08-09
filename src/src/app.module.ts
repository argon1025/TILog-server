import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/Logger.middleware';

// Load ENV
const ENV = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV.NODE_ENV ? '.env' : `.env.${ENV.NODE_ENV}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
// Add Middleware
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
