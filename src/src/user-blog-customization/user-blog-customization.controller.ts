import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserBlogCustomizationService } from './user-blog-customization.service';
import { CreateUserBlogCustomizationDto } from './dto/create-user-blog-customization.dto';
import { UpdateUserBlogCustomizationDto } from './dto/update-user-blog-customization.dto';

@Controller('user-blog-customization')
export class UserBlogCustomizationController {
  constructor(private readonly userBlogCustomizationService: UserBlogCustomizationService) {}

  @Post()
  create(@Body() createUserBlogCustomizationDto: CreateUserBlogCustomizationDto) {
    return this.userBlogCustomizationService.create(createUserBlogCustomizationDto);
  }

  @Get()
  findAll() {
    return this.userBlogCustomizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBlogCustomizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserBlogCustomizationDto: UpdateUserBlogCustomizationDto) {
    return this.userBlogCustomizationService.update(+id, updateUserBlogCustomizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBlogCustomizationService.remove(+id);
  }
}
