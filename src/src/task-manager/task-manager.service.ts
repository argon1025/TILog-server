import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class TaskManagerService {
  constructor(@InjectQueue('log') private readonly loggingQueue: Queue, @InjectQueue('image') private readonly imageQueue: Queue) {}

  /**
   * 에러 로그 전송 작업을 작업 큐에 등록합니다.
   * @param requestData
   * @returns
   */
  public async sendError(requestData: { location: string; developerComment: string; errorCode: number; errorObjectCode: string; message: object }) {
    if (requestData.errorCode !== 404) {
      const jobInfo = await this.loggingQueue.add(
        'send', // 작업 이름
        { data: requestData }, // 데이터
        {
          timeout: 3000, // 시간초과
          removeOnComplete: true, // 성공했을경우 삭제합니다
          removeOnFail: 30, // 실패로그가 얼마나 유지될지
          attempts: 5, // 작업 최대 시도 횟수
          backoff: { type: 'fixed', delay: 3000 }, // 작업이 실패했을 경우 3s마다 다시 시도합니다.
        },
      );
      return jobInfo.id;
    }
  }
}
