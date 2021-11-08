import Error from 'src/ExceptionFilters/Interface/error.interface';

// 코멘트 작성 실패
export class CommentWriteFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'CommentWriteFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed to write a comment.',
    kr: '코멘트 작성에 실패하였습니다.',
  };
}

// 답글 작성 실패
export class CommentToCommentWriteFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'CommentToCommentWriteFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed to write a reply.',
    kr: '답글 작성에 실패하였습니다.',
  };
}
// 추가 답글 불가능
export class DisableLevel implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'DisableLevel';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'can not write any more comments.',
    kr: '더이상 답글을 작성할 수 없습니다.',
  };
}
// 코멘트 작성 실패
export class ViewPostCommentsFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'ViewPostCommentsFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'view post comments failed',
    kr: '코멘트 데이터를 가져오는데 실패하였습니다.',
  };
}

// 코멘트 수정 실패
export class UpdateCommentsFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'UpdateCommentsFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'update comments failed',
    kr: '코멘트 데이터를 수정하는데 실패하였습니다.',
  };
}

// 코멘트 삭제 실패
export class DeleteCommentsFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'DeleteCommentsFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'delete comments failed',
    kr: '코멘트 데이터를 삭제하는데 실패하였습니다.',
  };
}
