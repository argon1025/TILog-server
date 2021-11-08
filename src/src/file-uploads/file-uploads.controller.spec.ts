import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadsController } from './file-uploads.controller';
import { FileUploadsService } from './file-uploads.service';

describe('FileUploadsController', () => {
  let controller: FileUploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadsController],
      providers: [FileUploadsService],
    }).compile();

    controller = module.get<FileUploadsController>(FileUploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
