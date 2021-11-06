import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadsService } from './file-uploads.service';

describe('FileUploadsService', () => {
  let service: FileUploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileUploadsService],
    }).compile();

    service = module.get<FileUploadsService>(FileUploadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
