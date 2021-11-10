import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { UserBlogCustomizationService } from './user-blog-customization.service';
import { CreateUserBlogCustomizationDto } from './dto/create-user-blog-customization.dto';
import { UpdateUserBlogCustomizationDto } from './dto/update-user-blog-customization.dto';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import { UserStats } from 'src/auth/decorators/userStats.decorator';

@Controller('user-blog-customization')
export class UserBlogCustomizationController {
  constructor(private readonly userBlogCustomizationService: UserBlogCustomizationService) {}

  @Post()
  // @UseGuards(AuthenticatedGuard)
  async createUserBlogCustomization(@UserStats('id') userID: number, @Body() createUserBlogCustomizationDto: CreateUserBlogCustomizationDto) {
    createUserBlogCustomizationDto.userID = userID;
    try {
      return await this.userBlogCustomizationService.createUserBlogCustomization(createUserBlogCustomizationDto);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  @Get(':userid')
  getUserBlogCustomization(@Param('userid') userID: number) {
    return this.userBlogCustomizationService.getUserBlogCustomization(userID);
  }

  @Patch()
  // @UseGuards(AuthenticatedGuard)
  async updateUserBlogCustomization(@UserStats('id') userID: number, @Body() updateUserBlogCustomizationDto: UpdateUserBlogCustomizationDto) {
    updateUserBlogCustomizationDto.userID = userID;
    try {
      return await this.userBlogCustomizationService.updateUserBlogCustomization(updateUserBlogCustomizationDto);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  @Delete()
  // @UseGuards(AuthenticatedGuard)
  deleteUserBlogCustomization(@UserStats('id') userID: number) {
    return this.userBlogCustomizationService.deleteUserBlogCustomization(userID);
  }
}
