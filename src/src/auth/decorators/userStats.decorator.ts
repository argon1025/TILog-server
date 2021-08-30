import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 유저 정보를 반환합니다.
export const UserStats = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
