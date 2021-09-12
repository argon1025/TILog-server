import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async create(@Body() createPostDto: any) {
    await this.postsService.getPostsByUserID(true, 1, 0, 10);
    return 'this.postsService.create(createPostDto)';
  }
}
