import Error from 'src/ExceptionFilters/Interface/error.interface';

// 유저 등록에 실패했을 때
export class UserCreateFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'UserCreateFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'user create failed',
    kr: '유저등록에 실패하였습니다.',
  };
}
