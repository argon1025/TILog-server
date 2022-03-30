// Core
import { Controller, Get, Post, Body, Param, Delete, HttpException, UseGuards, Version, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { CacheManagerService } from 'src/cache-manager/cache-manager.service';

// Custom
import { PostsService } from './posts.service';
import { RealIP } from 'nestjs-real-ip';
import { UserInfo } from 'src/auth/decorators/userInfo.decorator';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import ResponseUtility from 'src/utilities/Response.utility';

// Type
import { SessionInfo } from 'src/auth/dto/session-info.dto';
import { CreateDto } from './dto/Controller/Create.Posts.controller.DTO';
import { UpdateDto } from './dto/Controller/Update.Posts.controller.DTO copy';
import { CreatePostDto } from './dto/Services/CreatePost.DTO';
import { CreatePostTags } from './dto/Services/CreatePostTags.DTO';
import { GetPostDetailDto, GetPostDetailResponseDto } from './dto/Services/GetPostDetail.DTO';
import { GetPostsDto } from './dto/Services/GetPosts.DTO';
import { MostLikedRequestDto, searchScope } from './dto/Services/MostLikedPost.DTO';
import { SetPostToDislikeDto } from './dto/Services/SetPostToDislike.DTO';
import { SetPostToLikeDto } from './dto/Services/SetPostToLike.DTO';
import { SoftDeletePostDto } from './dto/Services/SoftDeletePost.DTO';
import { UpdatePostDto } from './dto/Services/UpdatePost.DTO';
// Error Type
import { PermissionDenied } from 'src/ExceptionFilters/Errors/Auth/Auth.error';
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import { PostNotFound } from 'src/ExceptionFilters/Errors/Posts/Post.error';

@Controller('')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService,
    private readonly CacheManagerService: CacheManagerService,
  ) {}

  /**
   * 포스트 생성요청을 처리합니다.
   * @guards 유저 인증
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('2')
  @Post('posts')
  @UseGuards(AuthenticatedGuard)
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트를 생성합니다.' })
  @ApiBody({
    type: CreateDto,
  })
  async create(@Body() requestData: CreateDto, @UserInfo() userData: SessionInfo) {
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
      const postId = await this.postsService.createPost(createPostRequestDto);

      // 응답
      return ResponseUtility.create(false, 'ok', { data: { postId: postId } });
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.create.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  /**
   * 포스트 수정요청을 처리합니다.
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @guards 게시글 삭제여부
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('2')
  @Put('posts/:postID')
  @UseGuards(AuthenticatedGuard)
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트를 수정합니다.' })
  @ApiBody({
    type: UpdateDto,
  })
  @ApiParam({
    name: 'postID',
    type: 'number',
    required: true,
    description: '포스트 아이디',
  })
  async update(@Body() requestData: UpdateDto, @UserInfo() userData: SessionInfo, @Param('postID', ParseIntPipe) postID: Number) {
    // PostID 상수 선언
    const POST_ID: string = String(postID);
    try {
      const IS_OWNER: boolean = await this.postsService.isOwner({ userId: userData.id, postId: POST_ID });
      if (!IS_OWNER) {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.update.NOT_OWNER`;
        // 인가 오류 발생
        throw new PermissionDenied(developerComment);
      }

      const IS_DELETED: boolean = await this.postsService.isDeleted({ postId: POST_ID });
      if (IS_DELETED) {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.update.DELETED_POST`;
        // 인가 오류 발생
        throw new PostNotFound(developerComment);
      }

      // 포스트 수정에 필요한 DTO 작성
      let UpdatePostRequestDto = new UpdatePostDto();
      UpdatePostRequestDto.id = POST_ID;
      UpdatePostRequestDto.categoryId = requestData.categoryId;
      UpdatePostRequestDto.thumbNailUrl = requestData.thumbNailUrl;
      UpdatePostRequestDto.title = requestData.title;
      UpdatePostRequestDto.markDownContent = requestData.markDownContent;
      UpdatePostRequestDto.private = requestData.private;

      // 포스트 업데이트를 요청합니다
      await this.postsService.updatePost(UpdatePostRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', { data: { postId: postID } });
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.update.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
  /**
   * 포스트 삭제요청을 처리합니다.
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @guards 게시글 삭제여부 확인
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('2')
  @Delete('posts/:postID')
  @UseGuards(AuthenticatedGuard)
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트를 삭제합니다.' })
  @ApiParam({
    name: 'postID',
    type: 'number',
    required: true,
    description: '포스트 아이디',
  })
  async delete(@UserInfo() userData: SessionInfo, @Param('postID', ParseIntPipe) postID: Number) {
    // PostID 상수 선언
    const POST_ID: string = String(postID);
    try {
      const IS_OWNER: boolean = await this.postsService.isOwner({ userId: userData.id, postId: POST_ID });

      if (!IS_OWNER) {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.delete.NOT_OWNER`;
        // 인가 오류 발생
        throw new PermissionDenied(developerComment);
      }

      const IS_DELETED: boolean = await this.postsService.isDeleted({ postId: POST_ID });
      if (IS_DELETED) {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.delete.DELETED_POST`;
        // 인가 오류 발생
        throw new PostNotFound(developerComment);
      }

      // 포스트 삭제에 필요한 DTO 작성
      let SoftDeletePostRequestDto = new SoftDeletePostDto();
      SoftDeletePostRequestDto.id = POST_ID;

      // 포스트 삭제를 요청합니다
      await this.postsService.softDeletePost(SoftDeletePostRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.delete.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
  /**
   * 포스트 디테일뷰 요청을 처리합니다
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @guards 게시글 삭제여부 확인
   * @guards 게시글 비밀글 여부 확인
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('2')
  @Get('posts/:postID')
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트 디테일 정보를 요청합니다.' })
  @ApiParam({
    name: 'postID',
    type: 'number',
    required: true,
    description: '포스트 아이디',
  })
  async getDetailFindByPostID(@UserInfo() userData: SessionInfo, @Param('postID', ParseIntPipe) postID: Number, @RealIP() userIp: string) {
    // PostID 상수 선언
    const POST_ID: string = String(postID);
    // 세션 유저 아이디, 미로그인일경우 undefined
    const USER_ID: number | undefined = userData?.id;
    // 해당 세션 유저가 해당 포스트에 좋아요를 누른상태를 저장하는 변수
    let IS_LIKED: boolean = false;
    try {
      // 유저에게 세션데이터가 있다면 요청 포스트의 작성자인지 확인합니다, 세션이 없으면 false를 반환합니다.
      const IS_OWNER: boolean = !USER_ID ? false : await this.postsService.isOwner({ userId: userData.id, postId: POST_ID });

      // 삭제된 포스트인지 확인합니다
      const IS_DELETED: boolean = await this.postsService.isDeleted({ postId: POST_ID });

      // 비밀글인지 확인합니다
      const IS_PRIVATE: boolean = await this.postsService.isPrivate({ postId: POST_ID });

      // 삭제된 게시글인지 검증합니다
      if (IS_DELETED) {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.getDetailFindByPostID.DELETED_POST`;
        // 인가 오류 발생
        throw new PostNotFound(developerComment);
      }

      // 작성자가 아닌 유저인 경우
      if (!IS_OWNER) {
        // Private한 게시글인지 확인합니다
        if (IS_PRIVATE) {
          // 개발자 코멘트 작성
          const developerComment = `PostsController.getDetailFindByPostID.IS_PRIVATE`;
          // 인가 오류 발생
          throw new PostNotFound(developerComment);
        }
      }

      if (typeof userIp === 'string') {
        // 조회수를 늘릴 수 있다면 늘립니다 이 작업은 강제되지 않습니다.
        await this.postsService.addPostViews({ id: POST_ID, userIp: userIp });
      }

      // 해당아이피의 좋아요 유무를 조회합니다
      if (!!USER_ID) {
        IS_LIKED = await this.postsService.isLiked({ postId: POST_ID, userId: USER_ID });
      }

      // 게시글 디테일 정보
      let POST_DATA: GetPostDetailResponseDto;

      // 게시물 정보를 조회하고 저장합니다
      let GetPostDetailRequestDto = new GetPostDetailDto();
      GetPostDetailRequestDto.id = POST_ID;
      POST_DATA = await this.postsService.getPostDetail(GetPostDetailRequestDto);
      POST_DATA.isLiked = IS_LIKED;

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', { data: POST_DATA });
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.getDetailFindByPostID.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
  /**
   * 특정 유저가 작성한 게시글 리스트를 요청합니다.
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('2')
  @Get('users/:userID/posts')
  @ApiTags('Posts')
  @ApiOperation({ summary: '특정 유저가 작성한 게시글 리스트를 요청합니다.' })
  @ApiParam({
    name: 'userID',
    type: 'number',
    required: true,
    description: '유저 아이디',
  })
  @ApiQuery({
    name: 'cursor',
    type: 'number',
    required: true,
    description: '포스트 커서 아이디',
  })
  async getAllFindByUserID(
    @UserInfo() userData: SessionInfo,
    @Param('userID', ParseIntPipe) userID: number,
    @Query('cursor', ParseIntPipe) cursor: number = 0,
  ) {
    // 최대 콘텐츠 로드 갯수설정 로드
    const CONTENT_LIMIT: number = this.configService.get<number>('POSTS_GET_CONTENT_LIMIT', 10);
    // 세션 아이디와 요청한 유저아이디가 동일할 경우 퍼스널 요청으로 간주합니다. 숨김 게시글을 표시할 수 있습니다
    const PERSONAL_REQUEST: boolean = userData?.id === userID ? true : false;
    try {
      // Dto Mapping
      let getPostsRequestDto = new GetPostsDto();
      // 최대 콘텐츠 조회 갯수
      getPostsRequestDto.contentLimit = CONTENT_LIMIT;
      // 현재 커서 넘버
      getPostsRequestDto.cursorNumber = cursor;
      // 요청하기 원하는 유저 아이디
      getPostsRequestDto.usersId = userID;
      // 게시글 소유주의 요청인지 유무
      getPostsRequestDto.personalRequest = PERSONAL_REQUEST;

      const getPostsResult = await this.postsService.getPostsFoundByMemberId(getPostsRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', { data: getPostsResult });
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.getAllFindByUserID.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
  /**
   * 게시글에 좋아요를 설정합니다.
   * @guards 유저 인증
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('2')
  @Post('posts/:postID/like')
  @UseGuards(AuthenticatedGuard)
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트에 좋아요를 설정합니다.' })
  @ApiParam({
    name: 'postID',
    type: 'number',
    required: true,
    description: '포스트 아이디',
  })
  async setLike(@UserInfo() userData: SessionInfo, @Param('postID', ParseIntPipe) postID: number) {
    // PostID 상수 선언
    const POST_ID = String(postID);
    try {
      let setLikeRequestDto = new SetPostToLikeDto();
      setLikeRequestDto.postsId = POST_ID;
      setLikeRequestDto.usersId = userData.id;

      const setLikeResult = await this.postsService.setPostToLike(setLikeRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', { data: { likeCount: setLikeResult.likes } });
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.setLike.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  /**
   * 게시글에 설정된 좋아요를 해제합니다.
   * @guards 유저 인증
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('2')
  @Delete('posts/:postID/like')
  @UseGuards(AuthenticatedGuard)
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트에 설정된 좋아요를 해제합니다.' })
  @ApiParam({
    name: 'postID',
    type: 'number',
    required: true,
    description: '포스트 아이디',
  })
  async setDislike(@UserInfo() userData: SessionInfo, @Param('postID', ParseIntPipe) postID: number) {
    // PostID 상수 선언
    const POST_ID = String(postID);
    try {
      let setDislikeRequestDto = new SetPostToDislikeDto();
      setDislikeRequestDto.postsId = POST_ID;
      setDislikeRequestDto.usersId = userData.id;

      const setDislikeResult = await this.postsService.setPostToDislike(setDislikeRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', { data: { likeCount: setDislikeResult.likes } });
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.setDislike.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  /**
   * 전체 멤버가 작성한 게시글 중 좋아요 수가 많은 게시글을 요청합니다
   * @todo 데이터 베이스 캐싱 및 커스텀 레포지토리화 및 전체적인 리팩터링 필요
   * @author seongrokLee <argon1025@gmail.com>
   */
  @Version('1')
  @Get('posts/trends/like')
  @ApiTags('Posts')
  @ApiOperation({ summary: '전체 멤버가 작성한 게시글 중 좋아요 수가 많은 게시글을 요청합니다.' })
  @ApiQuery({ name: 'searchScope', enum: searchScope })
  @ApiQuery({
    name: 'cursor',
    type: 'number',
    required: true,
    description: '포스트 커서 아이디',
  })
  async getMostLikedPosts(@Query('searchScope') searchScopeData: searchScope, @Query('cursor', ParseIntPipe) cursor: number = 0) {
    try {
      // searchScope 쿼리스트링이 유효한지 확인
      if (!(searchScopeData in searchScope)) {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.getMostLikedPosts.ANABEL_SCOPE_DATA`;
        throw new PostNotFound(developerComment);
      }

      // 캐시 데이터 조회
      const cacheResult = await this.CacheManagerService.getTrendPost({ ScopeData: searchScopeData, cursor: cursor });

      // 캐시가 존재할 경우
      if (!!cacheResult) {
        // 캐시 데이터를 리턴
        return ResponseUtility.create(false, 'ok', { data: cacheResult });
      }

      // 캐시가 없을 경우
      // Dto Mapping
      let getPostsRequestDto = new MostLikedRequestDto();
      // 최대 콘텐츠 조회 갯수
      getPostsRequestDto.contentLimit = this.configService.get<number>('POSTS_GET_CONTENT_LIMIT', 10);
      // 현재 커서 넘버
      getPostsRequestDto.cursorNumber = cursor;
      // 조회 기간
      getPostsRequestDto.date = searchScopeData;

      // 데이터베이스에서 정보 조회
      const getPostsResult = await this.postsService.getMostLiked(getPostsRequestDto);

      // 다음 요청에 사용할 캐시 저장
      await this.CacheManagerService.setTrendPost({ ScopeData: searchScopeData, cursor: cursor, postListData: getPostsResult, ttl: 5000 });

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', { data: getPostsResult });
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.getMostLikedPosts.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  /**
   * 포스트의 태그들을 등록하기
   * 관심사 분리 필요
   * @param param0
   * @param createPostTags
   * @returns
   */
  @Post('posts/:postsId/tags')
  public async createPostTags(@Param() { postsId }: { postsId: number }, @Body() createPostTags: CreatePostTags[]) {
    try {
      return await this.postsService.createPostTags(postsId, createPostTags);
    } catch (error) {
      // 사전 정의된 에러인 경우
      // Error interface Type Guard
      if ('codeNumber' in error && 'codeText' in error && 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 개발자 코멘트 작성
        const developerComment = `PostsController.createPostTags.${!!error.message ? error.message : JSON.stringify(error)}`;
        // 에러 객체 정의
        const errorResponse = new ErrorHandlerNotFound(developerComment);
        // 익셉션 필터로 에러객체 전달
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
