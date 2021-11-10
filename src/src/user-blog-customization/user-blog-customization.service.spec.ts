import { Test, TestingModule } from '@nestjs/testing';
import { UserBlogCustomizationService } from './user-blog-customization.service';

describe('UserBlogCustomizationService', () => {
  let service: UserBlogCustomizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBlogCustomizationService],
    }).compile();

    service = module.get<UserBlogCustomizationService>(UserBlogCustomizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
