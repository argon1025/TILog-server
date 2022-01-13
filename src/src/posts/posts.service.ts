import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Posts } from '../entities/Posts';
import Time from 'src/utilities/time.utility';

// ERROR
import {
  CreatePostTagFail,
  GetMostLikedPostFail,
  PostCreateFail,
  PostDetailGetFail,
  PostNotFound,
  PostSoftDeleteFail,
  PostUpdateFail,
  PostViewCountAddFail,
  SetPostToDislikeFail,
  SetPostToLikeFail,
} from '../ExceptionFilters/Errors/Posts/Post.error';

// DTO
import { GetPostWriterDto, GetPostWriterResponseDto } from './dto/Services/GetPostWriter.DTO';
import { CreatePostDto } from './dto/Services/CreatePost.DTO';
import { UpdatePostDto } from './dto/Services/UpdatePost.DTO';
import { SoftDeletePostDto } from './dto/Services/SoftDeletePost.DTO';
import { AddPostViewCountDto } from './dto/Services/AddPostViewCount.DTO';
import { GetPostsDto, GetPostsResponseDto } from './dto/Services/GetPosts.DTO';
import { GetPostDetailDto, GetPostDetailResponseDto } from './dto/Services/GetPostDetail.DTO';
import { SetPostToLikeDto, SetPostToLikeResponseDto } from './dto/Services/SetPostToLike.DTO';
import { SetPostToDislikeDto, SetPostToDislikeResponseDto } from './dto/Services/SetPostToDislike.DTO';
import { Tags } from 'src/entities/Tags';
import { PostsTags } from 'src/entities/PostsTags';
import { MostLikedRequestDto, MostLikedResponseDto, postListDataDTO } from './dto/Services/MostLikedPost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { compareArray } from 'src/utilities/compare.array.utility';
import { CreatePostTags } from './dto/Services/CreatePostTags.DTO';

// Custom Repository
import { PostRepository } from 'src/repositories/posts.repository';
import { PostViewsRepository } from 'src/repositories/postViews.repository';
import { PostLikesRepository } from 'src/repositories/PostLikes.repository';

@Injectable()
export class PostsService {
  constructor(
    private connection: Connection,

    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,

    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,

    @InjectRepository(PostsTags)
    private readonly postsTagsRepository: Repository<PostsTags>,
  ) {}

  /**
   * 게시글 소유, 삭제, 업데이트 정보를 반환합니다
   * @todo 매개변수 DTO를 작성해야합니다
   * @version 1.0.0
   */
  public async getPostWriterId(postWriterData: GetPostWriterDto): Promise<GetPostWriterResponseDto> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const queryResult = await queryRunner.manager.getCustomRepository(PostRepository).accessInfoFindOneOrFailByPostId(postWriterData.id);

      // DTO Mapping
      let responseData = new GetPostWriterResponseDto();
      responseData.usersId = queryResult.usersId;
      responseData.private = queryResult.private;
      responseData.deletedAt = queryResult.deletedAt;
      responseData.createdAt = queryResult.createdAt;
      responseData.updatedAt = queryResult.updatedAt;

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // return
      return responseData;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `${this.getPostWriterId.name}.${!!error.message ? error.message : JSON.stringify(error)}`;
      // 에러 생성
      throw new PostNotFound(developerComment);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 게시글의 소유주가 맞는지 확인합니다
   * @todo 매개변수 DTO를 작성해야합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  async isOwner(requestData: { userId: number; postId: string }): Promise<boolean> {
    const getPostWriterIdResult = await this.getPostWriterId({ id: requestData.postId });

    if (getPostWriterIdResult.usersId === requestData.userId) {
      // 유저 아이디가 맞을경우
      return true;
    } else {
      // 유저 아이디가 다를경우
      return false;
    }
  }

  /**
   * 게시글이 비밀글인지 확인합니다
   * @todo 매개변수 DTO를 작성해야합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  async isPrivate(requestData: { postId: string }): Promise<boolean> {
    const getPostWriterIdResult = await this.getPostWriterId({ id: requestData.postId });

    if (getPostWriterIdResult.private === 0) {
      // 비밀글이 아닐경우
      return false;
    } else {
      // 비밀글일 경우
      return true;
    }
  }
  /**
   * 게시글이 지워졌는지 확인합니다
   * @todo 매개변수 DTO를 작성해야합니다
   * @todo 오류처리 구문을 추가해야합니다
   * @todo getPostWriterId DTO를 생성후 요청해야합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  async isDeleted(requestData: { postId: string }): Promise<boolean> {
    const getPostWriterIdResult = await this.getPostWriterId({ id: requestData.postId });

    if (!getPostWriterIdResult.deletedAt) {
      // 삭제된 기록이 없을 경우
      return false;
    } else {
      // 삭제된 기록이 있을경우
      return true;
    }
  }

  /**
   * 포스트를 생성 합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async createPost(postData: CreatePostDto): Promise<boolean> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // Load DAO
      const postRepository = await queryRunner.manager.getCustomRepository(PostRepository);

      // Create Post
      const queryResult = await postRepository.create(
        postData.usersId,
        postData.categoryId,
        postData.title,
        postData.thumbNailUrl,
        postData.markDownContent,
        postData.private,
        Time.nowDate(),
      );

      // 테이블 업데이트가 반영되었는지 확인합니다.
      if (queryResult.raw.affectedRows === 0) {
        throw new Error('createPostQueryResult_AFFECTED_IS_0');
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // return
      return queryResult.raw.insertId;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.createPost.${!!error.message ? error.message : JSON.stringify(error)}`;
      // 에러
      throw new PostCreateFail(developerComment);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 포스트를 수정 합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async updatePost(postData: UpdatePostDto): Promise<boolean | PostUpdateFail> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // Now Time
      const NOW_DATE = Time.nowDate();

      // Load DAO
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);

      // modify Post
      const queryResult = await postRepository.modifyById(
        postData.id,
        postData.categoryId,
        postData.title,
        postData.thumbNailUrl,
        postData.markDownContent,
        postData.private,
        NOW_DATE,
      );

      /**
       * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 3 }, UpdateResult { generatedMaps: [], raw: [], affected: 0 }
       */

      // 수정된 사항이 없을경우
      if (queryResult.affected === 0) {
        throw new Error('affected is 0');
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // return
      return true;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.updatePost.${!!error.message ? error.message : JSON.stringify(error)}`;
      // 에러
      throw new PostUpdateFail(developerComment);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 포스트를 삭제 합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async softDeletePost(postData: SoftDeletePostDto): Promise<boolean> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // Now Time
      const NOW_DATE = Time.nowDate();

      // Load DAO
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);

      // softDelete Post
      const queryResult = await postRepository.softDeleteById(postData.id, NOW_DATE);

      // 수정된 사항이 없을경우
      if (queryResult.affected === 0) {
        throw new Error('deletePostQuery_AFFECTED_IS_0');
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // return
      return true;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.softDeletePost.${!!error.message ? error.message : JSON.stringify(error)}`;
      // 에러
      throw new PostSoftDeleteFail(developerComment);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 포스트 조회수를 +1 합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async addPostViews(viewData: AddPostViewCountDto): Promise<boolean> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // Now Time
      const NOW_DATE = Time.nowDate();

      // Load DAO
      const postViewRepository = queryRunner.manager.getCustomRepository(PostViewsRepository);
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);

      // 해당 아이피가 포스트를 조회한 적 있는지 확인합니다
      const postViewResult = await postViewRepository.findOneByPostIdAndUserIp(viewData.id, viewData.userIp);

      // 조회 기록이 있을경우 추가작업을 하지 않습니다.
      if (!!postViewResult) {
        throw new Error('THIS_IP_ALREADY_SEEN_THE_POST');
      }

      // 포스트 조회수를 조회하고 락을 설정합니다
      const getPostViewCountResult = await postRepository.getAndModifyViewCountById(viewData.id);

      //  해당하는 포스트를 찾을 수 없을때
      if (!getPostViewCountResult) {
        throw new Error('NOT_FOUND_POST');
      }

      // 현재 조회수에서 더한 데이터를 저장합니다
      const VIEW_COUNT = getPostViewCountResult.viewCounts + 1;

      // 포스트 뷰 카운트를 업데이트합니다
      const updatePostQueryResult = await postRepository.modifyViewCountById(viewData.id, VIEW_COUNT);

      // 테이블 업데이트가 반영되었는지 확인합니다.
      if (updatePostQueryResult.affected === 0) {
        throw new Error('updatePostQueryResult_AFFECTED_IS_0');
      }

      //PostView 테이블에 방문 기록을 저장합니다
      const updatePostViewResult = await postViewRepository.create(viewData.userIp, viewData.id, NOW_DATE);

      // 테이블 업데이트가 반영되었는지 확인합니다.
      if (updatePostViewResult.raw.affectedRows === 0) {
        throw new Error('updatePostViewResult_AFFECTED_IS_0');
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();

      // 이미 등록 된 경우 true리턴합니다
      if (error.message === 'THIS_IP_ALREADY_SEEN_THE_POST') {
        return true;
      }

      // 개발자 코멘트 생성
      const developerComment = `Post.service.addPostViews.${!!error.message ? error.message : JSON.stringify(error)}`;
      throw new PostViewCountAddFail(developerComment);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 특정 멤버가 작성한 게시글 리스트를 요청합니다
   * - Posts 테이블의 Index가 생성일 순으로 지정된다는 가정하에 작성되었습니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostsFoundByMemberId(getPostData: GetPostsDto): Promise<GetPostsResponseDto> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      // load DAO
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);

      // find Many Post By userId
      const queryResult = await postRepository.findManyByUserId(
        getPostData.usersId,
        getPostData.cursorNumber,
        getPostData.contentLimit,
        getPostData.personalRequest,
        'DESC',
      );

      // 찾은 포스트가 없다면 에러를 반환합니다.
      if (queryResult.length === 0) {
        throw new Error('POSTS_NOT_FOUND');
      }

      //DTO Mapping
      let response = new GetPostsResponseDto();
      // 포스트 리스트 데이터
      response.postListData = queryResult;
      // 포스트 마지막 데이터의 id를 커서 넘버로 저장
      response.nextCursorNumber = queryResult.length === 0 ? 0 : Number(queryResult[queryResult.length - 1].id);

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();

      // 결과를 리턴합니다
      return response;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.getPostsFoundByMemberId.${!!error.message ? error.message : JSON.stringify(error)}`;
      throw new PostNotFound(developerComment);
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }

  /**
   * 게시글 디테일 정보를 요청합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostDetail(postData: GetPostDetailDto): Promise<GetPostDetailResponseDto> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      // Load DAO
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);

      let postAndUserDataQueryResult = await postRepository.findOneById(postData.id);

      // 포스트를 찾지 못했을 경우
      if (!postAndUserDataQueryResult) {
        throw new Error('POST_NOT_FOUND');
      }

      // Result
      let queryResult = postAndUserDataQueryResult;

      //DTO Mapping
      let response = new GetPostDetailResponseDto();
      response.id = queryResult.id;
      response.usersId = queryResult.usersId;
      response.categoryId = queryResult.category.id;
      response.title = queryResult.title;
      response.thumbNailUrl = queryResult.thumbNailUrl;
      response.viewCounts = queryResult.viewCounts;
      response.likes = queryResult.likes;
      response.markDownContent = queryResult.markDownContent;
      response.private = queryResult.private;
      response.createdAt = queryResult.createdAt;
      response.updatedAt = queryResult.updatedAt;
      response.deletedAt = queryResult.deletedAt;
      response.userName = queryResult.users.userName;
      response.proFileImageUrl = queryResult.users.proFileImageUrl;
      response.mailAddress = queryResult.users.mailAddress;
      response.admin = queryResult.users.admin;
      response.categoryName = queryResult.category.categoryName;
      response.iconUrl = queryResult.category.iconUrl;
      response.blogTitle = queryResult.users.userblogCustomization?.blogTitle || null;
      response.selfIntroduction = queryResult.users.userblogCustomization?.selfIntroduction || null;
      response.statusMessage = queryResult.users.userblogCustomization?.statusMessage || null;
      response.TagData = queryResult.postsTags?.map((tagValue) => {
        return {
          id: tagValue.tags.id,
          tagsName: tagValue.tags.tagsName,
          createdAt: tagValue.tags.createdAt,
        };
      });

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();

      // 포스트 데이터를 리턴합니다.
      return response;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.getPostDetail.${!!error.message ? error.message : JSON.stringify(error)}`;
      // 에러를 반환합니다.
      throw new PostDetailGetFail(developerComment);
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }

  /**
   * 특정 게시글에 특정 유저가 좋아요를 눌렀는지 여부를 반환합니다
   * @TODO DTO 생성 필요
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  async isLiked(requestData: { postId: string; userId: number }) {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      const postLikeRepository = queryRunner.manager.getCustomRepository(PostLikesRepository);

      // 유저가 해당 포스트에 좋아요를 눌렀는지 확인합니다
      const getPostLikeResult = await postLikeRepository.findOneByPostIdAndUserId(requestData.postId, requestData.userId);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // 유저가 해당 포스트에 '좋아요'를 설정한 기록이 있을경우 true를 리턴합니다
      if (!!getPostLikeResult) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    } finally {
      // 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 해당 게시글에 Like를 설정합니다
   * - 유저는 포스트마다 '좋아요'를 하나만 설정할 수 있습니다.
   * - 이미 '좋아요'를 설정하였을 경우 오류를 반환합니다.
   * - 좋아요를 등록했을 경우 현재 '좋아요' 갯수를 반환합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  async setPostToLike(requestData: SetPostToLikeDto): Promise<SetPostToLikeResponseDto> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // load DAO
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);
      const postLikeRepository = queryRunner.manager.getCustomRepository(PostLikesRepository);

      // 유저가 해당 포스트에 좋아요를 눌렀는지 확인합니다
      const getPostLikeResult = await postLikeRepository.findOneByPostIdAndUserId(requestData.postsId, requestData.usersId);

      // 유저가 해당 포스트에 '좋아요'를 설정한 기록이 있을경우 에러를 리턴합니다
      if (!!getPostLikeResult) {
        throw new Error('ALREADY_SET_LIKE');
      }

      // Post 테이블의 현재 Like 카운트를 구하고 공유락을 설정합니다
      const getPostQueryResult = await postRepository.getAndModifyLikeCountById(requestData.postsId);

      // 만족하는 포스트를 찾을 수 없을 경우 에러를 리턴합니다
      if (!getPostQueryResult) {
        throw new Error('POST_NOT_FOUND');
      }

      // 갱신할 카운트를 설정합니다.
      const LIKE_COUNT = getPostQueryResult.likes + 1;

      // Post 테이블의 Like 카운트를 업데이트 합니다.
      const PostUpdateResult = await postRepository.modifyLikeCountById(requestData.postsId, LIKE_COUNT);

      // 테이블 업데이트가 반영되었는지 확인합니다
      if (PostUpdateResult.affected === 0) {
        throw new Error('PostUpdateResult_AFFECTED_IS_0');
      }

      // PostLike 테이블에 '좋아요' 기록을 저장합니다.
      const setPostLikeQueryResult = await postLikeRepository.create(requestData.postsId, requestData.usersId, Time.nowDate());
      // 테이블 업데이트가 반영되었는지 확인합니다
      if (setPostLikeQueryResult.raw.affectedRows === 0) {
        throw new Error('setPostLikeQuery_AFFECTED_IS_0');
      }

      // DTO Mapping
      let response = new SetPostToLikeResponseDto();
      response.likes = LIKE_COUNT;

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // 응답 리턴
      return response;
    } catch (error) {
      // 롤백, 오류 리턴
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.setPostToLike.${!!error.message ? error.message : JSON.stringify(error)}`;
      throw new SetPostToLikeFail(developerComment);
    } finally {
      // 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 게시글에 설정된 Like를 해제합니다
   * - 유저가 해당 포스트에 '좋아요'를 설정했을 경우에만 가능합니다
   * - 성공적으로 해제되었을 경우 현재 '좋아요' 갯수가 반환됩니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  async setPostToDislike(requestData: SetPostToDislikeDto): Promise<SetPostToDislikeResponseDto> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // load DAO
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);
      const postLikeRepository = queryRunner.manager.getCustomRepository(PostLikesRepository);

      // PostLike 테이블에 '좋아요' 기록이 있는지 확인합니다.
      const getPostLikeQueryResult = await await postLikeRepository.findOneByPostIdAndUserId(requestData.postsId, requestData.usersId);

      // 유저가 '좋아요'를 설정한 기록이 없을경우 에러를 리턴합니다.
      if (!getPostLikeQueryResult) {
        throw new Error('ALREADY_SET_DISLIKE');
      }

      // Post 테이블의 현재 Like 카운트를 구하고 공유락을 설정합니다
      const getPostQueryResult = await postRepository.getAndModifyLikeCountById(requestData.postsId);

      // 만족하는 포스트를 찾을 수 없을 경우 에러를 리턴합니다
      if (!getPostQueryResult) {
        throw new Error('POST_NOT_FOUND');
      }
      // 갱신할 카운트를 설정합니다.
      const LIKE_COUNT = getPostQueryResult.likes - 1;

      // Post 테이블의 Like 카운트를 업데이트 합니다.
      const PostUpdateResult = await postRepository.modifyLikeCountById(requestData.postsId, LIKE_COUNT);

      // 테이블 업데이트가 반영되었는지 확인합니다
      if (PostUpdateResult.affected === 0) {
        throw new Error('PostUpdateResult_AFFECTED_IS_0');
      }

      // PostLike 테이블의 '좋아요' 기록을 삭제합니다.
      const deletePostLikeQueryResult = await postLikeRepository.delete(requestData.postsId, requestData.usersId);

      // 테이블 업데이트가 반영되었는지 확인합니다.
      if (deletePostLikeQueryResult.affected === 0) {
        throw new Error('deletePostLikeQueryResult_AFFECTED_IS_0');
      }

      // DTO Mapping
      let response = new SetPostToDislikeResponseDto();
      response.likes = LIKE_COUNT;

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // 응답 리턴
      return response;
    } catch (error) {
      // 롤백, 오류 리턴
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.setPostToDislike.${!!error.message ? error.message : JSON.stringify(error)}`;
      // 에러 반환
      throw new SetPostToDislikeFail(developerComment);
    } finally {
      // 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 전체 멤버가 작성한 게시글 중 좋아요 수가 많은 게시글을 요청합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getMostLiked(requestData: MostLikedRequestDto) {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      // load DAO
      const postRepository = queryRunner.manager.getCustomRepository(PostRepository);

      const queryResult = await postRepository.getTrend({
        cursor: requestData.cursorNumber,
        dateScope: requestData.date,
        rowLimit: requestData.contentLimit,
      });

      // 찾은 포스트가 없다면 에러를 반환합니다.
      if (queryResult.length === 0) {
        throw new Error('POSTS_NOT_FOUND');
      }

      //DTO Mapping
      let responseData = new MostLikedResponseDto();
      // 포스트 리스트 데이터
      responseData.postListData = queryResult.map((queryRowData) => {
        let rowData = new postListDataDTO();
        rowData.id = queryRowData.postId; // PostID
        rowData.usersId = queryRowData.usersID;
        rowData.categoryId = queryRowData.categoryID;
        rowData.title = queryRowData.postTitle;
        rowData.viewCounts = queryRowData.postViewCounts;
        rowData.likes = queryRowData.postLikes;
        rowData.createdAt = queryRowData.createdAt;
        rowData.categoryName = queryRowData.categoryName;
        rowData.iconUrl = queryRowData.iconURL;
        rowData.userName = queryRowData.userName;
        rowData.proFileImageUrl = queryRowData.proFileImageURL;
        rowData.thumbNailUrl = queryRowData.thumbNailURL;

        return rowData;
      });
      // 포스트 마지막 데이터의 id를 커서 넘버로 저장
      responseData.nextCursorNumber = queryResult.length === 0 ? 0 : Number(queryResult[queryResult.length - 1].cursor_num);

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();

      // 결과를 리턴합니다
      return responseData;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      // 개발자 코멘트 생성
      const developerComment = `Post.service.getMostLiked.${!!error.message ? error.message : JSON.stringify(error)}`;
      throw new GetMostLikedPostFail(developerComment);
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }

  public async createPostTags(postsId: number, createPostTags: CreatePostTags[]) {
    try {
      const post = await this.postsRepository.findOne({ where: { id: postsId }, relations: ['postsTags', 'postsTags.tags'] });

      if (!post) {
        throw new Error('존재하지 않는 포스트 입니다.');
      }

      const tagsName = createPostTags.map((tag: Tags) => tag.tagsName);
      const registeredTagsName = post.postsTags.map((postTag: PostsTags) => postTag.tags.tagsName);

      /* 등록되지 않은 태그 검색 */
      const tagNameThatNeedsBeAdded = compareArray(tagsName, registeredTagsName);

      /* tags 생성
       * 있으면 그대로 리턴, 없으면 생성
       */
      const createdTags: Tags[] = await Promise.all(
        createPostTags.map(async (tag: Tags) => {
          const isTag = await this.tagsRepository.findOne({ id: tag.id });
          if (isTag) {
            return isTag;
          }
          return await this.tagsRepository.save({ tagsName: tag.tagsName });
        }),
      );

      /**
       * 포스트에 태그 연결
       * 이미 연결되어 있는 태그는 연결하지 않음
       */
      await Promise.all(
        createdTags.map(async (tag: Tags) => {
          const postsTags = await this.postsTagsRepository.findOne({ where: { posts: post, tags: tag } });

          if (!postsTags) {
            await this.postsTagsRepository.save({ posts: post, tags: tag, createdAt: new Date() });
          }
        }),
      );

      return true;
    } catch (error) {
      // 개발자 코멘트 생성
      const developerComment = `Post.service.createPostTags.${!!error.message ? error.message : JSON.stringify(error)}`;
      throw new CreatePostTagFail(developerComment);
    }
  }
}
