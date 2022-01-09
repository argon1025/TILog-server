import { HttpService } from '@nestjs/axios';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';

@Processor('log')
export class LogConsumer {
  constructor(private httpService: HttpService) {}

  @Process('send')
  async sendError(job) {
    const ERROR_DATA = job?.data?.data;
    try {
      await firstValueFrom(
        this.httpService.post('https://hooks.slack.com/services/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', {
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
        }),
      );
      return {};
    } catch (error) {
      throw new Error('log.send job fail');
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
