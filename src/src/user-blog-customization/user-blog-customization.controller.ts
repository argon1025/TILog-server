import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Version } from '@nestjs/common';
import { UserBlogCustomizationService } from './user-blog-customization.service';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import { UserStats } from 'src/auth/decorators/userStats.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserBlogCustomizationDto } from './dto/controller/CreateUserBlogCustomization.dto';
import { UserBlogCustomizationDetailDto } from './dto/UserBlogCustomizationDetail.dto';
import { UpdateUserBlogCustomizationDto } from './dto/controller/UpdateUserBlogCustomization.dto';

@ApiTags('UserBlogCustomization')
@Controller('user-blog-customization')
export class UserBlogCustomizationController {
  constructor(private readonly userBlogCustomizationService: UserBlogCustomizationService) {}

  @Version('1')
  @Post()
  @ApiOperation({ summary: '유저 블로그 커스텀 데이터를 등록합니다.' })
  @ApiBody({
    type: CreateUserBlogCustomizationDto,
  })
  // @UseGuards(AuthenticatedGuard)
  async createUserBlogCustomization(@UserStats('id') userID: number, @Body() createUserBlogCustomizationDto: CreateUserBlogCustomizationDto) {
    const userBlogCustomizationDetailDto = new UserBlogCustomizationDetailDto();
    userBlogCustomizationDetailDto.usersId = userID;
    userBlogCustomizationDetailDto.blogTitle = createUserBlogCustomizationDto.blogTitle;
    userBlogCustomizationDetailDto.statusMessage = createUserBlogCustomizationDto.statusMessage;
    userBlogCustomizationDetailDto.selfIntroduction = createUserBlogCustomizationDto.selfIntroduction;
    try {
      return await this.userBlogCustomizationService.createUserBlogCustomization(userBlogCustomizationDetailDto);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  @Version('1')
  @Get(':userid')
  @ApiOperation({ summary: '유저 블로그 커스텀 데이터를 가져옵니다.' })
  // @UseGuards(AuthenticatedGuard)
  async getUserBlogCustomization(@Param('userid') userID: number) {
    try {
      return await this.userBlogCustomizationService.getUserBlogCustomization(userID);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  @Version('1')
  @Patch()
  @ApiOperation({ summary: '유저 블로그 커스텀 데이터를 수정합니다.' })
  @ApiBody({
    type: UpdateUserBlogCustomizationDto,
  })
  // @UseGuards(AuthenticatedGuard)
  async updateUserBlogCustomization(@UserStats('id') userID: number, @Body() updateUserBlogCustomizationDto: UpdateUserBlogCustomizationDto) {
    const userBlogCustomizationDetailDto = new UserBlogCustomizationDetailDto();
    userBlogCustomizationDetailDto.usersId = userID;
    userBlogCustomizationDetailDto.blogTitle = updateUserBlogCustomizationDto.blogTitle;
    userBlogCustomizationDetailDto.statusMessage = updateUserBlogCustomizationDto.statusMessage;
    userBlogCustomizationDetailDto.selfIntroduction = updateUserBlogCustomizationDto.selfIntroduction;
    try {
      return await this.userBlogCustomizationService.updateUserBlogCustomization(userBlogCustomizationDetailDto);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  @Version('1')
  @Delete()
  @ApiOperation({ summary: '유저 블로그 커스텀 데이터를 삭제합니다.' })
  // @UseGuards(AuthenticatedGuard)
  deleteUserBlogCustomization(@UserStats('id') userID: number) {
    return this.userBlogCustomizationService.deleteUserBlogCustomization(userID);
  }
}
