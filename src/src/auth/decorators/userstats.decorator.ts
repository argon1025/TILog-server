import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 유저 정보를 반환합니다.
export const UserStats = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});
