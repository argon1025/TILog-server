import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { LogConsumer } from './logging.processor';
import { TaskManagerService } from './task-manager.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'log',
      limiter: {
        // 작업제한 설정
        max: 1, // 1개씩만 처리
        duration: 1000, // 1초당
      },
    }),
    BullModule.registerQueue({
      name: 'image',
    }),
    HttpModule,
    ConfigModule,
  ],
  providers: [TaskManagerService, LogConsumer],
  exports: [TaskManagerService],
})
export class TaskManagerModule {}
