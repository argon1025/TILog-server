import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileUploadsService } from './file-uploads.service';

@Controller('file-uploads')
export class FileUploadsController {
  constructor(private readonly fileUploadsService: FileUploadsService) {}

  @Get()
  findAll() {
    return this.fileUploadsService.findAll();
  }
}
