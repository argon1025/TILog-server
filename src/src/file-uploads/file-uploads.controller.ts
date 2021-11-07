import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadsService } from './file-uploads.service';

@Controller('file-uploads')
export class FileUploadsController {
  constructor(private readonly fileUploadsService: FileUploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async findAll(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log(file);
      const result = await this.fileUploadsService.imageFileUpload({
        file: file,
        usersId: 1,
        fileName: 'test',
      });

      console.log(result);
    } catch (error) {
      console.log(error);
    }
    return 'file upload test';
  }
}
