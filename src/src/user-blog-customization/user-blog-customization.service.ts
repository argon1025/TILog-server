import { Injectable } from '@nestjs/common';
import { CreateUserBlogCustomizationDto } from './dto/create-user-blog-customization.dto';
import { UpdateUserBlogCustomizationDto } from './dto/update-user-blog-customization.dto';

@Injectable()
export class UserBlogCustomizationService {
  createUserBlogCustomization(createUserBlogCustomizationDto: CreateUserBlogCustomizationDto) {
    return 'This action adds a new userBlogCustomization';
  }

  getUserBlogCustomization() {
    return `This action returns one userBlogCustomization`;
  }
  updateUserBlogCustomization(id: number, updateUserBlogCustomizationDto: UpdateUserBlogCustomizationDto) {
    return `This action updates a #${id} userBlogCustomization`;
  }

  deleteUserBlogCustomization(id: number) {
    return `This action removes a #${id} userBlogCustomization`;
  }
}
