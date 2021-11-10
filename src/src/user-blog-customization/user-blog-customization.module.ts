import { Module } from '@nestjs/common';
import { UserBlogCustomizationService } from './user-blog-customization.service';
import { UserBlogCustomizationController } from './user-blog-customization.controller';

@Module({
  controllers: [UserBlogCustomizationController],
  providers: [UserBlogCustomizationService]
})
export class UserBlogCustomizationModule {}
