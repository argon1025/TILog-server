import Error from 'src/ExceptionFilters/Interface/Error.interface';

// 코멘트 작성 실패
export class FaildCreateComment implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FailedCreateComment';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Failed comment create.',
    kr: '코멘트 생성에 실패하였습니다.',
  };
}

// 답글 작성 실패
export class FaildCreateReply implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FailedCreateReply';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Failed create reply',
    kr: '답글 작성에 실패하였습니다.',
  };
}

// 답글에 추가 답글을 작성
export class MaxLevelReached implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'MaxLevelReached';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'That comment is a reply.',
    kr: '해당 댓글은 답글입니다.',
  };
}

// 포스트의 코멘트를 불러오는데 실패
export class FaildGetComments implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FaildGetComments';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Failed to bring up the comments on the post.',
    kr: '포스트의 코멘트를 불러오는데 실패하였습니다.',
  };
}

// 코멘트의 답글을 불러오는데 실패
export class FaildGetReplies implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FaildGetReply';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Failed to bring up the reply on the comment.',
    kr: '코멘트의 답글을 불러오는데 실패하였습니다.',
  };
}

// 특정 코멘트 하나 보기
export class FaildGetComment implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FaildGetComment';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed view one comment',
    kr: '코멘트를 읽는데 실패하였습니다.',
  };
}

// 존재하지 않는 코멘트
export class NotFoundComment implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'NotFoundComment';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'No comments were found.',
    kr: '존재하지않는 코멘트입니다.',
  };
}

// 코멘트 수정 실패
export class FaildUpdateComment implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FaildUpdateComment';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Failed update comment',
    kr: '코멘트 데이터를 수정하는데 실패하였습니다.',
  };
}

// 코멘트 삭제 실패
export class FaildDeleteComment implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FaildDeleteComment';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Failed delete comment',
    kr: '코멘트 데이터를 삭제하는데 실패하였습니다.',
  };
}

// 코멘트 복원 실패
export class FaildRestoreComment implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'FaildRestoreComment';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Failed  restore comment',
    kr: '코멘트 데이터를 복원하는데 실패하였습니다.',
  };
}

// 코멘트 작성자 확인
export class NotCommentAuthor implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'NotCommentAuthor';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Not the author of the comment.',
    kr: '코멘트의 작성자가 아닙니다.',
  };
}

// 복구 실패
export class AlreadyRestored implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'AlreadyRestored';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: `It's already been restored.`,
    kr: '이미 복원된 댓글입니다.',
  };
}
