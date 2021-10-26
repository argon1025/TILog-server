import Error from 'src/ExceptionFilters/Interface/error.interface';

// 지정 게시글을 찾을 수 없을때 발생한다
export class PostNotFound implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'PostNotFound';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'No posts were found',
    kr: '포스트를 찾을 수 없습니다.',
  };
}
