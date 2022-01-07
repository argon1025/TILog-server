import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheManagerService } from './cache-manager.service';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Redis config
        const REDIS_HOST = configService.get<string>('REDIS_HOST', 'localhost');
        const REDIS_PORT = configService.get<number>('REDIS_PORT', 6379);
        return { store: redisStore, host: REDIS_HOST, port: REDIS_PORT };
      },
    }),
  ],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
