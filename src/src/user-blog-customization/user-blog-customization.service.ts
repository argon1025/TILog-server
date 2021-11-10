import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserblogCustomization } from 'src/entities/UserblogCustomization';
import { CreateUserBlogCustomizationFailed } from 'src/ExceptionFilters/Errors/UserBlogCustomization/UserBlogCustomization.Error';
import { Repository } from 'typeorm';
import { CreateUserBlogCustomizationDto } from './dto/create-user-blog-customization.dto';
import { UpdateUserBlogCustomizationDto } from './dto/update-user-blog-customization.dto';

@Injectable()
export class UserBlogCustomizationService {
  constructor(@InjectRepository(UserblogCustomization) private userblogCustomizationRepo: Repository<UserblogCustomization>) {}

  /**
   * create UserBlogCustomization
   * 유저 개인설정 생성
   *
   * @param createUserBlogCustomizationDto
   * @returns Promise<UserblogCustomization>
   */
  async createUserBlogCustomization(createUserBlogCustomizationDto: CreateUserBlogCustomizationDto): Promise<UserblogCustomization> {
    const { userID, blogTitle, statusMessage, selfIntroduction } = createUserBlogCustomizationDto;
    try {
      return await this.userblogCustomizationRepo.save({
        usersId: userID,
        blogTitle: blogTitle,
        statusMessage: statusMessage,
        selfIntroduction: selfIntroduction,
      });
    } catch (error) {
      throw new CreateUserBlogCustomizationFailed(
        `service.userblogcustomization.createuserblogcustomization.${!!error.message ? error.message : 'Unknown_Error'}`,
      );
    }
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
