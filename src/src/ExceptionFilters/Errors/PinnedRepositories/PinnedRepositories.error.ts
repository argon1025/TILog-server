import Error from 'src/ExceptionFilters/Interface/Error.interface';

export class CreatePinnedRepositoriesFail implements Error {
  constructor(public readonly description: string) {}

  public readonly codeNumber = 400;

  public readonly codeText = 'CreatePinnedRepositoriesFail';

  public readonly message = {
    en: 'fail to create pinned repositories',
    kr: 'pinned된 레포지토리를 등록하는데 실패했습니다.',
  };
}
