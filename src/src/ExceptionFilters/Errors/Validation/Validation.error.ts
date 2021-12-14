import Error from 'src/ExceptionFilters/Interface/Error.interface';

// 요청 데이터검증에 실패했을 경우
export class ValidationFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'ValidationFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Validation failed',
    kr: '요청한 데이터가 올바르지 않습니다.',
  };
}
