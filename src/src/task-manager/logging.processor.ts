import { HttpService } from '@nestjs/axios';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';

@Processor('log')
export class LogConsumer {
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  @Process('send')
  async sendError(job) {
    // 작업 데이터 로드
    const ERROR_DATA = job?.data?.data;
    const MESSAGE: object = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '에러 이벤트 발생',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*HTTP Code:*\n${ERROR_DATA.errorCode}`,
            },
            {
              type: 'mrkdwn',
              text: `*API Location:*\n${ERROR_DATA.location}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Error Type:*\n${ERROR_DATA.errorObjectCode}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*오류에 대한 개발자 코멘트:*\n\`\`\`${ERROR_DATA.developerComment}\`\`\``,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*응답 메시지:*\n\`\`\`${JSON.stringify(ERROR_DATA.message)}\`\`\``,
            },
          ],
        },
      ],
    };
    const WEB_HOOK_URL: string | undefined = this.configService.get<string>('ERROR_SLACK_WEBHOOK_URL', undefined);

    try {
      // 웹훅 URL이 설정되었을 경우에만 작업을 진행합니다
      if (WEB_HOOK_URL != undefined) {
        await firstValueFrom(this.httpService.post(WEB_HOOK_URL, MESSAGE));
      }
      return 'ok';
    } catch (error) {
      throw new Error('log.send job fail');
    }
  }

  // 작업 로깅 이벤트
  @OnQueueActive()
  onActive(job: Job) {
    Logger.log(` jobID: ${job.id} jobName: ${JSON.stringify(job.name)}`, 'Task.Log');
  }
}
