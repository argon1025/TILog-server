import { Module } from '@nestjs/common';
import { UserBlogCustomizationService } from './user-blog-customization.service';
import { UserBlogCustomizationController } from './user-blog-customization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserblogCustomization } from 'src/entities/UserblogCustomization';

@Module({
  imports: [TypeOrmModule.forFeature([UserblogCustomization])],
  controllers: [UserBlogCustomizationController],
  providers: [UserBlogCustomizationService],
})
export class UserBlogCustomizationModule {}
