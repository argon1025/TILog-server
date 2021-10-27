import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 주소로 리다이렉트 시킵니다.
export const RedirectClient = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const response = ctx.switchToHttp().getResponse();
  const redirect = response.redirect(process.env.REDIRECT_FRONT);
  return redirect;
});
