import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogConsumer } from './logging.processor';
import { TaskManagerService } from './task-manager.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'log',
      limiter: {
        max: 1,
        duration: 1000,
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
