import { Controller, Get, Session } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @SkipThrottle(true) // 상태체크 엔드포인트는 요청 제한 규칙을 적용받지 않습니다
  getHello(@Session() session) {
    // 해당 리소스 조회시 발급되는 기본세션을 삭제합니다.
    session.destroy();

    // 상태를 리턴합니다
    return { status: 'ok' };
  }
}
