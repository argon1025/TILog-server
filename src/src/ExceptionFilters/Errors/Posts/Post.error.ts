import Error from 'src/ExceptionFilters/Interface/Error.interface';

// 지정 게시글을 찾을 수 없을때 발생한다
export class PostNotFound implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'POST_NOT_FOUND';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'No post found',
    kr: '포스트를 찾을 수 없습니다.',
  };
}

// 포스트 생성에 실패
export class PostCreateFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'POST_CREATE_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Fail to create a post',
    kr: '포스트를 생성하는데 실패했습니다.',
  };
}

// 포스트 업데이트 실패
export class PostUpdateFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'POST_UPDATE_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Fail to Update post',
    kr: '포스트를 업데이트 하는데 실패했습니다.',
  };
}

// 포스트 업데이트 실패
export class PostSoftDeleteFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'POST_DELETE_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Fail to Delete post',
    kr: '포스트를 삭제하지 못했습니다..',
  };
}

// 포스트 조회수 설정 실패
export class PostViewCountAddFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 500;

  public readonly codeText = 'POST_VIEW_COUNT_ADD_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Fail to Add ViewCount',
    kr: '포스트 디테일 정보를 요청하는 도중 오류가 발생했습니다',
  };
}

// 포스트 Detail 조회 실패
export class PostDetailGetFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'POST_NOT_FOUND';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'No post found',
    kr: '포스트가 존재하지 않습니다.',
  };
}

// 좋아요 등록 실패
export class SetPostToLikeFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'SET_POST_LIKE_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Fail to set Like',
    kr: '좋아요 설정에 실패했습니다.',
  };
}

// 좋아요 해제 실패
export class SetPostToDislikeFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'SET_POST_LIKE_UNDO_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Fail to undo Like',
    kr: '좋아요 실행 취소에 실패했습니다.',
  };
}

// 좋아요 트랜드 포스트 조회 실패
export class GetMostLikedPostFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 404;

  public readonly codeText = 'GET_TRADING_POST_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Fail to get trading posts',
    kr: '인기 포스트가 없습니다.',
  };
}

// 포스트에 태그 연결 실패
export class CreatePostTagFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'CONNECT_POST_TAGS_FAIL';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'fail to connect post tags',
    kr: '게시글 태그 연결에 실패했습니다.',
  };
}
