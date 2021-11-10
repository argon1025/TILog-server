import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserblogCustomization } from 'src/entities/UserblogCustomization';
import {
  CreateUserBlogCustomizationFailed,
  DeleteUserBlogCustomizationFailed,
  GetUserBlogCustomizationFailed,
  UpdateUserBlogCustomizationFailed,
} from 'src/ExceptionFilters/Errors/UserBlogCustomization/UserBlogCustomization.Error';
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
  /**
   * get UserBlogCustomization
   * 유저의 개인 블로그 설정 보기
   * @param userID
   * @returns Promise<UserblogCustomization>
   */
  async getUserBlogCustomization(userID: number): Promise<UserblogCustomization> {
    try {
      return await this.userblogCustomizationRepo.findOne({ usersId: userID });
    } catch (error) {
      throw new GetUserBlogCustomizationFailed(
        `service.userblogcustomization.getserblogcustomization.${!!error.message ? error.message : 'Unknown_Error'}`,
      );
    }
  }
  /**
   * update UserBlogCustomization
   * 유저의개인 블로그 설정 업데이트
   *
   * @param updateUserBlogCustomizationDto
   * @returns
   */
  async updateUserBlogCustomization(updateUserBlogCustomizationDto: UpdateUserBlogCustomizationDto): Promise<UserblogCustomization> {
    const { userID, blogTitle, statusMessage, selfIntroduction } = updateUserBlogCustomizationDto;
    try {
      return await this.userblogCustomizationRepo.save({
        usersId: userID,
        blogTitle: blogTitle,
        statusMessage: statusMessage,
        selfIntroduction: selfIntroduction,
      });
    } catch (error) {
      throw new UpdateUserBlogCustomizationFailed(
        `service.userblogcustomization.updateuserblogcustomization.${!!error.message ? error.message : 'Unknown_Error'}`,
      );
    }
  }
  /**
   * delete UserBlogCustomization
   * 유저의개인 블로그 설정 삭제
   *
   * @param userID
   * @returns Promise<UserblogCustomization>
   */
  async deleteUserBlogCustomization(userID: number): Promise<UserblogCustomization> {
    try {
      return await this.userblogCustomizationRepo.save({
        usersId: userID,
        blogTitle: null,
        statusMessage: null,
        selfIntroduction: null,
      });
    } catch (error) {
      throw new DeleteUserBlogCustomizationFailed(
        `service.userblogcustomization.deleteuserblogcustomization.${!!error.message ? error.message : 'Unknown_Error'}`,
      );
    }
  }
}
