import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Version } from '@nestjs/common';
import { UserStats } from 'src/auth/decorators/userStats.decorator';
import { SessionInfo } from 'src/auth/dto/session-info.dto';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import ResponseUtility from 'src/utilities/Response.utility';
import { CreateDto } from './dto/Controller/Create.Posts.controller.DTO';
import { CreatePostDto } from './dto/Services/CreatePost.DTO';
import { PostsService } from './posts.service';

@Controller('')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 포스트 생성요청을 처리합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Post('posts')
  @UseGuards(AuthenticatedGuard)
  async create(@Body() requestData: CreateDto, @UserStats() userData: SessionInfo) {
    try {
      // 포스트 생성에 필요한 DTO
      let createPostRequestDto = new CreatePostDto();
      createPostRequestDto.usersId = userData.id;
      createPostRequestDto.categoryId = requestData.categoryId;
      createPostRequestDto.title = requestData.title;
      createPostRequestDto.thumbNailUrl = requestData.thumbNailUrl;
      createPostRequestDto.markDownContent = requestData.markDownContent;
      createPostRequestDto.private = requestData.private;

      // 포스트 생성요청
      await this.postsService.createPost(createPostRequestDto);

      // 응답
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`posts.controller.create.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
