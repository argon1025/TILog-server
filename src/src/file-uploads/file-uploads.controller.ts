// Nest Core
import { Controller, Post, UseInterceptors, UploadedFile, HttpException, UseGuards, Version } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadsService } from './file-uploads.service';

// Custom
import { UserInfo } from 'src/auth/decorators/userInfo.decorator';
import ResponseUtility from 'src/utilities/Response.utility';
import Time from '../utilities/time.utility';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';

// Type
import { SessionInfo } from 'src/auth/dto/session-info.dto';
import { ImageFileUploadDto } from './dto/service/ImageFileUpload.DTO';
// Error Type
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import { FileSizeExceeded } from 'src/ExceptionFilters/Errors/FileUploads/FileUpload.error';

@Controller('')
export class FileUploadsController {
  constructor(private readonly fileUploadsService: FileUploadsService, private readonly configService: ConfigService) {}
  /**
   * 이미지를 업로드합니다
   * @guards 유저 인증
   * @guards 파일 크기 제한
   * @guards 파일 이름 생성
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Post('files/images')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiTags('Upload')
  @ApiOperation({ summary: '이미지 파일을 업로드합니다.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UserInfo() userData: SessionInfo, @UploadedFile() file: Express.Multer.File) {
    try {
      // 최대 파일사이즈 환경설정 로드
      const MAXIMUM_IMAGE_FILE_SIZE = this.configService.get<number>('MAXIMUM_IMAGE_FILE_SIZE_BYTES', 5120);
      // 파일 이름 생성
      const FILE_NAME = `${userData.id}${Math.random().toString(36).substring(2, 15)}${Time.nowDate()}`;

      // 파일 사이즈 제한 확인
      if (file.size >= MAXIMUM_IMAGE_FILE_SIZE) {
        throw new Error('IMAGE_FILE_SIZE_EXCEEDED');
      }

      // Dto Mapping
      let imageFileUploadRequestDto = new ImageFileUploadDto();
      imageFileUploadRequestDto.file = file;
      imageFileUploadRequestDto.usersId = userData.id;
      imageFileUploadRequestDto.fileName = FILE_NAME;

      // 파일 업로드를 요청합니다.
      const fileUploadResult = await this.fileUploadsService.imageFileUpload(imageFileUploadRequestDto);

      // 응답
      return ResponseUtility.create(false, 'ok', { data: fileUploadResult.pathUrl });
    } catch (error) {
      // 사전 정의된 에러인 경우
      // Error interface Type Guard
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else if (error.message === 'IMAGE_FILE_SIZE_EXCEEDED') {
        // 파일사이즈 초과 에러
        const errorResponse = new FileSizeExceeded(`Uploads.controller.uploadImage.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`Uploads.controller.uploadImage.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
