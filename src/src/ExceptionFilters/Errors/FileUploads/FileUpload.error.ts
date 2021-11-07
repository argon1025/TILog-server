import Error from '../../Interface/Error.interface';

export class S3FileUploadFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 400;

  public readonly codeText = 'S3FileUploadFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'S3 File Upload Fail',
    kr: 'S3 파일 업로드에 실패했습니다.',
  };
}

export class ImageUploadFail implements Error {
  // 개발자 코멘트를 생성자 매개변수로 할당할 수 있다.
  constructor(public readonly description?) {}

  // 미리 정의된 에러코드
  public readonly codeNumber = 500;

  public readonly codeText = 'ImageFileUploadFail';

  // 미리 정의된 메시지 객체
  public readonly message = {
    en: 'Image File Upload Fail',
    kr: '이미지 파일 업로드에 실패했습니다.',
  };
}
