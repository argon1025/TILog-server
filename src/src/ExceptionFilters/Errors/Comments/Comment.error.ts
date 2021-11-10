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
    en: 'failed to write a comment to comment.',
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
// 모든 코멘트 보기
export class ViewAllCommentsFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'ViewAllCommentsFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed view all comments',
    kr: '코멘트 데이터를 가져오는데 실패하였습니다.',
  };
}

// 코멘트 수정 실패
export class UpdateCommentFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'UpdateCommentFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed update comment',
    kr: '코멘트 데이터를 수정하는데 실패하였습니다.',
  };
}

// 코멘트 삭제 실패
export class DeleteCommentFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'DeleteCommentFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed delete comment',
    kr: '코멘트 데이터를 삭제하는데 실패하였습니다.',
  };
}

// 코멘트 복원 실패
export class UnDeleteCommentFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'UnDeleteCommentFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed  undelete comment',
    kr: '코멘트 데이터를 복원하는데 실패하였습니다.',
  };
}

// 특정 코멘트 하나 보기
export class ViewOneCommentFaild implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'ViewOneCommentFaild';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed view one comment',
    kr: '코멘트를 읽는데 실패하였습니다.',
  };
}

// 코멘트 소유주 확인
export class NotCommentOwner implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'NotCommentOwner';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'you are not comment owner',
    kr: '코멘트의 작성자가 아닙니다.',
  };
}
