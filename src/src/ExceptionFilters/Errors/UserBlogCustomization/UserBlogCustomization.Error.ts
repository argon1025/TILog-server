import Error from 'src/ExceptionFilters/Interface/error.interface';

// 개인 블로그 설정 생성 실패
export class CreateUserBlogCustomizationFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'CreateUserBlogCustomizationFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed create user-blog-customiztion',
    kr: '개인 블로그 설정 생성 실패하였습니다.',
  };
}
// 개인 블로그 설정 가져오기 실패
export class GetUserBlogCustomizationFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'GetUserBlogCustomizationFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed get user-blog-customiztion',
    kr: '개인 블로그 설정 가져오기 실패하였습니다.',
  };
}
// 개인 블로그 설정 생성 실패
export class UpdateUserBlogCustomizationFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'UpdateUserBlogCustomizationFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed update user-blog-customiztion',
    kr: '개인 블로그 설정 업데이트 실패하였습니다.',
  };
}
// 개인 블로그 설정 삭제 실패
export class DeleteUserBlogCustomizationFailed implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'DeleteUserBlogCustomizationFailed';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'failed delete user-blog-customiztion',
    kr: '개인 블로그 설정 삭제 실패하였습니다.',
  };
}
