import { Controller, Get, Session } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipThrottle(true) // 상태체크 엔드포인트는 요청 제한 규칙을 적용받지 않습니다
  getHello(@Session() session): string {
    session.destroy();
    return 'Tilog';
  }
}
