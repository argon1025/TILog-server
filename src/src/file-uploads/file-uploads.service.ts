import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { ImageUpload } from 'src/entities/ImageUpload';
import { ImageUploadFail } from 'src/ExceptionFilters/Errors/FileUploads/FileUpload.error';
import { Connection } from 'typeorm';
import { ImageFileUploadDto, ImageFileUploadResponseDto } from './dto/service/ImageFileUpload.DTO';
import { S3FileDeleteDto } from './dto/service/S3FileDelete.DTO';
import Time from '../utilities/time.utility';
import { S3FileUploadDto, S3FileUploadResponseDto } from './dto/service/s3FileUpload.DTO';

@Injectable()
export class FileUploadsService {
  private readonly S3_BUCKET_NAME: string;
  private readonly S3: AWS.S3;
  constructor(private readonly configService: ConfigService, private connection: Connection) {
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
   * @throws {S3FileUploadFail}
   */
  private async s3FileUpload(requestData: S3FileUploadDto): Promise<S3FileUploadResponseDto> {
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
      let response: S3FileUploadResponseDto = new S3FileUploadResponseDto();
      response.fileName = s3FileUploadRequestResult.Key;
      response.location = s3FileUploadRequestResult.Location;

      return response;
    } catch (error) {
      // 에러 반환
      throw error;
    }
  }

  /**
   * s3 파일 삭제를 요청합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async s3FileDelete(requestData: S3FileDeleteDto): Promise<boolean> {
    try {
      /**
       * 파일 삭제를 요청합니다
       * @Returns void
       */
      await this.S3.deleteObject({ Bucket: this.S3_BUCKET_NAME, Key: requestData.key }).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 하나의 이미지를 업로드하고 URL을 반환합니다.
   * - 파일버퍼, 커스텀 파일이름, 유저 아이디
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async imageFileUpload(requestData: ImageFileUploadDto): Promise<ImageFileUploadResponseDto> {
    // 파일 타입
    let FILE_TYPE: string;
    // 파일 확장자
    let FILE_EXTENSION: string;

    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // 파일의 타입, 확장자를 저장합니다 'image/png'
      const FILE_INFO = requestData.file.mimetype.split('/');
      FILE_TYPE = FILE_INFO[0];
      FILE_EXTENSION = FILE_INFO[1];

      // 파일 타입이 이미지가 아닐 경우 오류를 반환합니다
      console.log(`${FILE_TYPE} / ${FILE_EXTENSION}`);
      if (FILE_TYPE != 'image') {
        throw new Error('THIS_IS_NOT_IMAGE');
      }

      // 파일 업로드 DTO를 작성합니다.
      let s3FileUploadDTO = new S3FileUploadDto();
      s3FileUploadDTO.fileName = `${requestData.fileName}.${FILE_EXTENSION}`;
      s3FileUploadDTO.fileRaw = requestData.file.buffer;
      s3FileUploadDTO.mimeType = requestData.file.mimetype;

      // 파일 업로드를 요청하고 결과를 받습니다.
      const s3FileUploadResult = await this.s3FileUpload(s3FileUploadDTO);

      // 데이터베이스에 파일 업로드정보를 기록합니다.
      const imageUploadQuery = queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(ImageUpload)
        .values([
          {
            usersId: requestData.usersId,
            pathUrl: s3FileUploadResult.location,
            fileSizeBytes: requestData.file.size,
            fileType: requestData.file.mimetype,
            createdAt: Time.nowDate(),
          },
        ])
        .updateEntity(false);

      /**
       *
       * @Returns InsertResult {
       *   identifiers: [],
       *   generatedMaps: [],
       *   raw: ResultSetHeader {
       *     fieldCount: 0,
       *     affectedRows: 1,
       *     insertId: 2,
       *     info: '',
       *     serverStatus: 3,
       *     warningStatus: 0
       *   }
       * }
       */
      const imageUploadQueryResult = await imageUploadQuery.execute();
      // 테이블 삽입이 반영되었는지 확인합니다.
      if (imageUploadQueryResult.raw.affectedRows === 0) {
        throw new Error('imageUploadQueryResult_AFFECTED_IS_0');
      }

      // response DTO Mapping
      const response = new ImageFileUploadResponseDto();
      response.pathUrl = s3FileUploadResult.location;

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      return response;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();

      // 데이터베이스 파일 업로드 정보 기록에 실패했을 경우 등록된 파일의 삭제를 요청합니다.
      if (error.message === 'imageUploadQueryResult_AFFECTED_IS_0') {
        this.s3FileDelete({ key: `${requestData.fileName}.${FILE_EXTENSION}` });
      }

      // 최종 에러 생성
      throw new ImageUploadFail(`service.file-uploads.imageFileUpload.${!!error.message ? JSON.stringify(error.message) : 'Unknown_Error'}`);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }
}
