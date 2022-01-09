import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class TaskManagerService {
  constructor(@InjectQueue('log') private readonly loggingQueue: Queue, @InjectQueue('image') private readonly imageQueue: Queue) {}

  /**
   * 에러 로그 전송작업을 생성합니다
   * @param requestData
   * @returns
   */
  public async sendError(requestData: { location: string; developerComment: string; errorCode: number; errorObjectCode: string; message: object }) {
    const jobInfo = await this.loggingQueue.add(
      'send',
      { data: requestData },
      {
        timeout: 3000,
        removeOnComplete: true,
        removeOnFail: 30,
        attempts: 5,
        backoff: { type: 'fixed', delay: 3000 }, // 3s
      },
    );
    return jobInfo.id;
  }
}
