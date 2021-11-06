import Error from 'src/ExceptionFilters/Interface/error.interface';

// 코멘트 작성 실패
export class CommentWriteFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'CommentWriteFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'comment write failed',
    kr: '코멘트 작성에 실패하였습니다.',
  };
}

// 리플 작성 실패
export class ReplyWriteFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'ReplyWriteFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'reply write failed',
    kr: '코멘트 작성에 실패하였습니다.',
  };
}
