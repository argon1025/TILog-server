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

  // @Patch()
  // update(@Param('id') id: string, @Body() updateUserBlogCustomizationDto: UpdateUserBlogCustomizationDto) {
  //   return this.userBlogCustomizationService.update(+id, updateUserBlogCustomizationDto);
  // }

  // @Delete()
  // remove(@Param('id') id: string) {
  //   return this.userBlogCustomizationService.remove(+id);
  // }
}
