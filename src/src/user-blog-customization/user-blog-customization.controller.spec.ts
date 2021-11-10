import { Test, TestingModule } from '@nestjs/testing';
import { UserBlogCustomizationController } from './user-blog-customization.controller';
import { UserBlogCustomizationService } from './user-blog-customization.service';

describe('UserBlogCustomizationController', () => {
  let controller: UserBlogCustomizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBlogCustomizationController],
      providers: [UserBlogCustomizationService],
    }).compile();

    controller = module.get<UserBlogCustomizationController>(UserBlogCustomizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
