import Error from 'src/ExceptionFilters/Interface/error.interface';

// 정의된 에러 핸들러가 없는 오류일 경우
export class ErrorHandlerNotFound implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 500;

  public readonly codeText = 'ErrorHandlerNotFound';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'No handler found for Error.',
    kr: '정의되지 않은 오류.',
  };
}
