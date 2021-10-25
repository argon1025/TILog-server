import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Redis의 세션을 제거합니다.
export const Session = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.session;
});
