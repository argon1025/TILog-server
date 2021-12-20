import Error from 'src/ExceptionFilters/Interface/Error.interface';

export class FailedAuthentication implements Error {
  constructor(public readonly description: string) {}

  public readonly codeNumber = 403;

  public readonly codeText = 'FailedAuthentication';

  public readonly message = {
    en: 'Failed authentication',
    kr: '인증에 실패하였습니다.',
  };
}
