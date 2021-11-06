import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3FileUploadFail } from 'src/ExceptionFilters/Errors/FileUploads/FileUpload.error';
import { S3FileDeleteDto } from './dto/service/S3FileDelete.DTO';
import { S3FileUploadDto, S3FileUploadResponseDto } from './dto/service/S3FileUpload.DTO';

@Injectable()
export class FileUploadsService {
  private readonly S3_BUCKET_NAME: string;
  private readonly S3: AWS.S3;
  constructor(private readonly configService: ConfigService) {
    // S3 초기화
    this.S3_BUCKET_NAME = this.configService.get<string>('AWS_S3_BUCKET', 'noName');
    this.S3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY', 'noKey'),
      secretAccessKey: this.configService.get<string>('AWS_S3_KEY_SECRET', 'noKey'),
    });
  }

  /**
   * s3 파일 업로드를 요청합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async s3FileUpload(requestData: S3FileUploadDto) {
    try {
      // 파일 업로드를 요청합니다.
      const s3FileUploadRequestResult = await this.S3.upload({
        Bucket: this.S3_BUCKET_NAME,
        Key: requestData.fileName,
        Body: requestData.fileRaw,
        ACL: 'public-read',
        ContentType: requestData.mimeType,
        ContentDisposition: 'inline',
      }).promise();

      /**
       * 업로드 성공시 리턴
       * {
       *   ETag: '"80de771230dbee28123d9e0a085bc1e"',
       *   Location: 'https://test-bucket.s3.amazonaws.com/testFile.pdf',
       *   key: 'testFile.pdf',
       *   Key: 'testFile.pdf',
       *   Bucket: 'test-bucket'
       * }
       */
      // console.log(s3FileUploadRequestResult);

      // DTO Mapping
      let response = new S3FileUploadResponseDto();
      response.fileName = s3FileUploadRequestResult.Key;
      response.location = s3FileUploadRequestResult.Location;

      return response;
    } catch (error) {
      // 에러 반환
      throw new S3FileUploadFail(`fileUpload.service.s3FileUpload.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  /**
   * s3 파일 삭제를 요청합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async s3FileDelete(requestData: S3FileDeleteDto) {
    try {
      // 파일 삭제를 요청합니다.
      await this.S3.deleteObject({ Bucket: this.S3_BUCKET_NAME, Key: requestData.key }).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 하나의 이미지를 업로드하고 URL을 반환합니다.
   * - 파일버퍼, 파일이름,
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async imageFileUpload() {}
}
