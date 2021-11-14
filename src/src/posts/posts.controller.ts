import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Version, Put, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserStats } from 'src/auth/decorators/userstats.decorator';
import { SessionInfo } from 'src/auth/dto/session-info.dto';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import ResponseUtility from 'src/utilities/Response.utility';
import { CreateDto } from './dto/Controller/Create.Posts.controller.DTO';
import { UpdateDto } from './dto/Controller/Update.Posts.controller.DTO copy';
import { CreatePostDto } from './dto/Services/CreatePost.DTO';
import { GetPostDetailDto, GetPostDetailResponseDto } from './dto/Services/GetPostDetail.DTO';
import { GetPostsDto } from './dto/Services/GetPosts.DTO';
import { SetPostToDislikeDto } from './dto/Services/SetPostToDislike.DTO';
import { SetPostToLikeDto } from './dto/Services/SetPostToLike.DTO';
import { SoftDeletePostDto } from './dto/Services/SoftDeletePost.DTO';
import { UpdatePostDto } from './dto/Services/UpdatePost.DTO';
import { PostsService } from './posts.service';

@Controller('')
export class PostsController {
  constructor(private readonly postsService: PostsService, private readonly configService: ConfigService) {}

  /**
   * 포스트 생성요청을 처리합니다.
   * @guards 유저 인증
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Post('posts')
  @UseGuards(AuthenticatedGuard)
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트를 생성합니다.' })
  @ApiBody({
    type: CreateDto,
  })
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
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @guards 게시글 삭제여부 확인
   * @todo isOwner, isDeleted 서비스의 String()함수 취약 여부 테스트 필요
   * @todo isOwner, isDeleted 서비스의 오류 처리 로직 점검 필요
   * @todo isOwner, isDeleted 서비스의 오류 헨들러 생성 필요
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
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
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @guards 게시글 삭제여부 확인
   * @todo isOwner, isDeleted 서비스의 String()함수 취약 여부 테스트 필요
   * @todo isOwner, isDeleted 서비스의 오류 처리 로직 점검 필요
   * @todo isOwner, isDeleted 서비스의 오류 헨들러 생성 필요
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
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
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @guards 게시글 삭제여부 확인
   * @guards 게시글 비밀글 여부 확인
   * @todo isOwner, isDeleted 서비스의 String()함수 취약 여부 테스트 필요
   * @todo isOwner, isDeleted 서비스의 오류 처리 로직 점검 필요
   * @todo isOwner, isDeleted 서비스의 오류 헨들러 생성 필요
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Get('posts/:postID')
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트 디테일 정보를 요청합니다.' })
  @ApiParam({
    name: 'postID',
    type: 'number',
    required: true,
    description: '포스트 아이디',
  })
  async getDetailFindByPostID(@UserStats() userData: SessionInfo, @Param('postID') postID: Number) {
    try {
      // 삭제된 게시글 여부를 확인하고 저장합니다.
      const IS_DELETE: boolean = await this.postsService.isDeleted({ id: String(postID) });

      // 비밀글 여부를 확인하고 저장합니다.
      const IS_PRIVATE: boolean = await this.postsService.isPrivate({ id: String(postID) });

      // 게시글 소유주 여부를 확인하고 저장합니다.
      const IS_OWNER: boolean = await this.postsService.isOwner({ usersId: userData.id, id: String(postID) });

      // 게시글 디테일 정보
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
  /**
   * 특정 유저가 작성한 게시글 리스트를 요청합니다.
   * @guards 유저 인증
   * @guards 게시글 소유주 인가
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
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
  async getAllFindByUserID(@UserStats() userData: SessionInfo, @Param('userID') userID: number, @Query('cursor') cursor: number = 0) {
    try {
      // Dto Mapping
      let getPostsRequestDto = new GetPostsDto();
      // 최대 콘텐츠 조회 갯수
      getPostsRequestDto.contentLimit = this.configService.get<number>('POSTS_GET_CONTENT_LIMIT', 10);
      // 현재 커서 넘버
      getPostsRequestDto.cursorNumber = cursor;
      // 요청하기 원하는 유저 아이디
      getPostsRequestDto.usersId = userID;
      // 게시글 소유주의 요청인지 유무
      getPostsRequestDto.personalRequest = userData?.id === userID ? true : false;

      const getPostsResult = await this.postsService.getPostsFoundByMemberId(getPostsRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', getPostsResult);
    } catch (error) {
      console.log(error);
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error) {
        console.log('??');
        throw new HttpException(error, error.codeNumber);
      } else {
        console.log('!!');
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`posts.controller.getAllFindByUserID.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
  /**
   * 게시글에 좋아요를 설정합니다.
   * @guards 유저 인증
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
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
  async setLike(@UserStats() userData: SessionInfo, @Param('postID') postID: number) {
    try {
      let setLikeRequestDto = new SetPostToLikeDto();
      setLikeRequestDto.postsId = String(postID);
      setLikeRequestDto.usersId = userData.id;

      const setLikeResult = await this.postsService.setPostToLike(setLikeRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', setLikeResult.likes);
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`posts.controller.setLike.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  /**
   * 게시글에 설정된 좋아요를 해제합니다.
   * @guards 유저 인증
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Delete('posts/:postsID/like')
  @UseGuards(AuthenticatedGuard)
  @ApiTags('Posts')
  @ApiOperation({ summary: '포스트에 설정된 좋아요를 해제합니다.' })
  @ApiParam({
    name: 'postID',
    type: 'number',
    required: true,
    description: '포스트 아이디',
  })
  async setDislike(@UserStats() userData: SessionInfo, @Param('postID') postID: number) {
    try {
      let setDislikeRequestDto = new SetPostToDislikeDto();
      setDislikeRequestDto.postsId = String(postID);
      setDislikeRequestDto.usersId = userData.id;

      const setDislikeResult = await this.postsService.setPostToDislike(setDislikeRequestDto);

      // 응답 리턴
      return ResponseUtility.create(false, 'ok', setDislikeResult.likes);
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`posts.controller.setLike.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
