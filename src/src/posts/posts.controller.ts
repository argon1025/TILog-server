import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { PostNotFound } from 'src/ExceptionFilters/Errors/Posts/Post.error';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async create(@Body() createPostDto: any) {
    try {
      console.log('실행됨');
      this.postsService.postErrorTest();
    } catch (errorData) {
      // 에러 종류 특정
      if (errorData instanceof PostNotFound) {
        throw new HttpException(errorData, errorData.codeNumber);
      }
    }
    return 'this.postsService.create(createPostDto)';
  }
}
