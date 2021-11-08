import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Version, Put } from '@nestjs/common';
import { UserStats } from 'src/auth/decorators/userStats.decorator';
import { SessionInfo } from 'src/auth/dto/session-info.dto';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import ResponseUtility from 'src/utilities/Response.utility';
import { CreateDto } from './dto/Controller/Create.Posts.controller.DTO';
import { UpdateDto } from './dto/Controller/Update.Posts.controller.DTO copy';
import { CreatePostDto } from './dto/Services/CreatePost.DTO';
import { GetPostDetailDto, GetPostDetailResponseDto } from './dto/Services/GetPostDetail.DTO';
import { SoftDeletePostDto } from './dto/Services/SoftDeletePost.DTO';
import { UpdatePostDto } from './dto/Services/UpdatePost.DTO';
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
  /**
   * 포스트 수정요청을 처리합니다.
   * @todo isOwner, isDeleted 서비스의 String()함수 취약 여부 테스트 필요
   * @todo isOwner, isDeleted 서비스의 오류 처리 로직 점검 필요
   * @todo isOwner, isDeleted 서비스의 오류 헨들러 생성 필요
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Put('posts/:postID')
  @UseGuards(AuthenticatedGuard)
  async update(@Body() requestData: UpdateDto, @UserStats() userData: SessionInfo, @Param('postID') postID: Number) {
    try {
      // 게시물의 소유주와 요청한 유저의 아이디가 동일한지 검증합니다
      if (!(await this.postsService.isOwner({ usersId: userData.id, id: String(postID) }))) {
        throw new Error('NOT_OWNER_POST');
      }
      // 삭제된 게시글인지 검증합니다
      if (await this.postsService.isDeleted({ id: String(postID) })) {
        throw new Error('POST_WAS_DELETED');
      }

      // 포스트 수정에 필요한 DTO 작성
      let UpdatePostRequestDto = new UpdatePostDto();
      UpdatePostRequestDto.id = String(postID);
      UpdatePostRequestDto.categoryId = requestData.categoryId;
      UpdatePostRequestDto.thumbNailUrl = requestData.thumbNailUrl;
      UpdatePostRequestDto.title = requestData.title;
      UpdatePostRequestDto.markDownContent = requestData.markDownContent;
      UpdatePostRequestDto.private = requestData.private;

      // 포스트 업데이트를 요청합니다
      await this.postsService.updatePost(UpdatePostRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`posts.controller.update.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
  /**
   * 포스트 삭제요청을 처리합니다.
   * @todo isOwner, isDeleted 서비스의 String()함수 취약 여부 테스트 필요
   * @todo isOwner, isDeleted 서비스의 오류 처리 로직 점검 필요
   * @todo isOwner, isDeleted 서비스의 오류 헨들러 생성 필요
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Delete('posts/:postID')
  @UseGuards(AuthenticatedGuard)
  async delete(@UserStats() userData: SessionInfo, @Param('postID') postID: Number) {
    try {
      // 게시물의 소유주와 요청한 유저의 아이디가 동일한지 검증합니다
      if (!(await this.postsService.isOwner({ usersId: userData.id, id: String(postID) }))) {
        throw new Error('NOT_OWNER_POST');
      }
      // 삭제된 게시글인지 검증합니다
      if (await this.postsService.isDeleted({ id: String(postID) })) {
        throw new Error('POST_WAS_DELETED');
      }

      // 포스트 삭제에 필요한 DTO 작성
      let SoftDeletePostRequestDto = new SoftDeletePostDto();
      SoftDeletePostRequestDto.id = String(postID);

      // 포스트 삭제를 요청합니다
      await this.postsService.softDeletePost(SoftDeletePostRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`posts.controller.update.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
  /**
   * 포스트 디테일뷰 요청을 처리합니다
   * @todo isOwner, isDeleted 서비스의 String()함수 취약 여부 테스트 필요
   * @todo isOwner, isDeleted 서비스의 오류 처리 로직 점검 필요
   * @todo isOwner, isDeleted 서비스의 오류 헨들러 생성 필요
   * @todo
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Get('posts/:postID')
  async getDetailByPostID(@UserStats() userData: SessionInfo, @Param('postID') postID: Number) {
    try {
      // 삭제된 게시글 여부를 확인하고 저장합니다.
      const IS_DELETE: boolean = await this.postsService.isDeleted({ id: String(postID) });

      // 비밀글 여부를 확인하고 저장합니다.
      const IS_PRIVATE: boolean = await this.postsService.isPrivate({ id: String(postID) });

      // 게시글 소유주 여부를 확인하고 저장합니다.
      const IS_OWNER: boolean = await this.postsService.isOwner({ usersId: userData.id, id: String(postID) });

      let POST_DATA: GetPostDetailResponseDto;

      // 삭제된 게시글인지 검증합니다
      if (IS_DELETE) {
        throw new Error('POST_WAS_DELETED');
      }

      // 로그인 세션이 존재하지 않는 유저, 게시물의 소유주가 아닌 유저
      if (userData === undefined || !IS_OWNER) {
        // Private한 게시글인지 확인합니다
        if (IS_PRIVATE) {
          // 에러를 반환합니다
          throw new Error('POST_IS_PRIVATE');
        } else {
          // 게시물 정보를 조회하고 저장합니다
          let GetPostDetailRequestDto = new GetPostDetailDto();
          GetPostDetailRequestDto.id = String(postID);
          POST_DATA = await this.postsService.getPostDetail(GetPostDetailRequestDto);
        }
      } else {
        // 게시물의 소유주인 경우
        // 게시물 정보를 조회하고 저장합니다
        let GetPostDetailRequestDto = new GetPostDetailDto();
        GetPostDetailRequestDto.id = String(postID);
        POST_DATA = await this.postsService.getPostDetail(GetPostDetailRequestDto);
      }

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', POST_DATA);
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`posts.controller.update.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
