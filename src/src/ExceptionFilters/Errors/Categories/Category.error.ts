import Error from 'src/ExceptionFilters/Interface/Error.interface';

export class CategoryCreateFail implements Error {
  constructor(public readonly description: string) {}

  public readonly codeNumber = 400;

  public readonly codeText = 'CategoryCreateFail';

  public readonly message = {
    en: 'fail to create category',
    kr: '카테고리를 생성하는데 실패했습니다.',
  };
}

export class CategorySearchFail implements Error {
  constructor(public readonly description: string) {}

  public readonly codeNumber = 400;

  public readonly codeText = 'CategorySearchFail';

  public readonly message = {
    en: 'fail to search category',
    kr: '카테고리를 검색하는데 실패했습니다.',
  };
}
