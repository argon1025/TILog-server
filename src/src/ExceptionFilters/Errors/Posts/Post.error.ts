import Error from 'src/ExceptionFilters/Interface/Error.interface';

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

// 포스트 작성자를 찾을 수 없을때
export class PostWriterNotFound implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'PostWriterNotFound';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Post writer Not Found',
    kr: '포스트 작성자를 찾을 수 없습니다.',
  };
}

// 포스트 생성에 실패
export class PostCreateFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'PostCreateFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to create post',
    kr: '포스트를 생성하는데 실패했습니다.',
  };
}

// 포스트 업데이트 실패
export class PostUpdateFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'PostUpdateFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to Update post',
    kr: '포스트를 업데이트 하는데 실패했습니다.',
  };
}

// 포스트 업데이트 실패
export class PostSoftDeleteFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'PostSoftDeleteFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to Delete post',
    kr: '포스트를 삭제하지 못했습니다..',
  };
}

// 포스트 조회수 설정 실패
export class PostViewCountAddFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'PostViewCountAdderFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to Add PostViewCount',
    kr: '조회수를 카운트하지 못했습니다.',
  };
}

// 포스트 조회 실패
export class PostGetFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'PostsNotFound';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to get Posts',
    kr: '표시할 포스트가 없습니다.',
  };
}

// 포스트 Detail 조회 실패
export class PostDetailGetFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'PostDetailNotFound';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to get PostDetail',
    kr: '자세히 표시할 포스트가 없습니다.',
  };
}

// 좋아요 등록 실패
export class SetPostToLikeFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'SetPostToLikeFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to Post Like',
    kr: '좋아요를 설정할 수 없습니다.',
  };
}

// 좋아요 해제 실패
export class SetPostToDislikeFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'SetPostToDislikeFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to Post Dislike',
    kr: '좋아요를 해제할 수 없습니다.',
  };
}

// 좋아요 트랜드 포스트 조회 실패
export class GetMostLikedPostFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'GetMostLikedPostFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to get Posts',
    kr: '표시할 포스트가 없습니다.',
  };
}
