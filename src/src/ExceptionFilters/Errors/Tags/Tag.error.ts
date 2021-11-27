import Error from 'src/ExceptionFilters/Interface/Error.interface';

export class TagCreateFail implements Error {
  constructor(public readonly description: string) {}

  public readonly codeNumber = 400;

  public readonly codeText = 'TagCreateFail';

  public readonly message = {
    en: 'fail to create tag',
    kr: '태그를 생성하는데 실패했습니다.',
  };
}

export class TagSearchFail implements Error {
  constructor(public readonly description: string) {}

  public readonly codeNumber = 400;

  public readonly codeText = 'TagCreateFail';

  public readonly message = {
    en: 'fail to search tag',
    kr: '태그를 검색하는데 실패했습니다.',
  };
}
