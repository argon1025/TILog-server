import { PickType } from '@nestjs/swagger';
import { ImageUpload } from '../../../entities/ImageUpload';

export class ImageFileUploadDto extends PickType(ImageUpload, ['usersId']) {
  /*
  file: Express.Multer.File;
    {
  fieldname: 'file',
  originalname: '1DCE665A-E073-41A5-A3F7-40963105AE11.jpeg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff e1 23 a6 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 05 01 1a 00 05 00 00 00 01 00 00 … 98858 more bytes>,
  size: 98908
}
    */
  file: Express.Multer.File;
  fileName: string;
}

export class ImageFileUploadResponseDto extends PickType(ImageUpload, ['pathUrl']) {}
