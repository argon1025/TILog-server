import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadsService {
  findAll() {
    return `This action returns all fileUploads`;
  }
}
