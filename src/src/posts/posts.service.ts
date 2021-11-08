import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Posts } from '../entities/Posts';
import { PostView } from 'src/entities/PostView';
import { Users } from 'src/entities/Users';
import { PostLike } from 'src/entities/PostLike';
import Time from '../utilities/Time.utility';

// ERROR
import {
  PostCreateFail,
  PostDetailGetFail,
  PostGetFail,
  PostSoftDeleteFail,
  PostUpdateFail,
  PostViewCountAddFail,
  PostWriterNotFound,
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

@Injectable()
export class PostsService {
  constructor(private connection: Connection) {}

  /**
   * 포스트 아이디로 작성자 아이디, 비밀글 유무, 삭제 유무를 반환합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostWriterId(postWriterData: GetPostWriterDto): Promise<GetPostWriterResponseDto | PostWriterNotFound> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // 쿼리 작성
      const query = queryRunner.manager
        .createQueryBuilder()
        .select(['postTable.usersId', 'postTable.private'])
        .from(Posts, 'postTable')
        .where('postTable.id = :postId', { postId: postWriterData.id })
        .maxExecutionTime(1000);

      /**
       * @Returns Posts { usersId: 1 }
       */
      const queryResult = await query.getOneOrFail();

      // DTO Mapping
      let responseData = new GetPostWriterResponseDto();
      responseData.usersId = queryResult.usersId;
      responseData.private = queryResult.private;
      responseData.deletedAt = queryResult.deletedAt;

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // return
      return responseData;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 에러 생성
      throw new PostWriterNotFound(`service.post.getPostWriter.${!!error.message ? error.message : 'Unknown_Error'}`);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
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
      // 쿼리 작성
      const query = queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Posts)
        .values([
          {
            usersId: postData.usersId,
            categoryId: postData.categoryId,
            title: postData.title,
            thumbNailUrl: postData.thumbNailUrl,
            markDownContent: postData.markDownContent,
            private: postData.private,
            createdAt: Time.nowDate(),
          },
        ])
        .updateEntity(false);

      /**
       * @Returns InsertResult {
       * identifiers: [],
       * generatedMaps: [],
       * raw: ResultSetHeader {
       *   fieldCount: 0,
       *   affectedRows: 1,
       *   insertId: 5,
       *   info: '',
       *   serverStatus: 3,
       *   warningStatus: 0
       *  }
       * }
       */
      const queryResult = await query.execute();
      // 테이블 업데이트가 반영되었는지 확인합니다.
      if (queryResult.raw.affectedRows === 0) {
        throw new Error('createPostQueryResult_AFFECTED_IS_0');
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // return
      return true;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 에러
      throw new PostCreateFail(`service.post.createPost.${!!error.message ? error.message : 'Unknown_Error'}`);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 포스트를 수정 합니다.
   * - 서비스 로직 요청전 비밀글, 삭제글 여부 확인이 필요합니다.
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
      // 쿼리 작성
      const query = queryRunner.manager
        .createQueryBuilder()
        .update(Posts)
        .set({
          categoryId: postData.categoryId,
          title: postData.title,
          thumbNailUrl: postData.thumbNailUrl,
          markDownContent: postData.markDownContent,
          private: postData.private,
          updatedAt: Time.nowDate(),
        })
        .where('id = :postID', { postID: postData.id })
        .updateEntity(false);

      /**
       * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 3 }, UpdateResult { generatedMaps: [], raw: [], affected: 0 }
       */
      const queryResult = await query.execute();

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
      // 에러
      throw new PostUpdateFail(`service.post.updatePost.${!!error.message ? error.message : 'Unknown_Error'}`);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 포스트를 삭제 합니다.
   * - 서비스 로직 요청전 유저인가 확인이 필요합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async softDeletePost(postData: SoftDeletePostDto): Promise<boolean | PostSoftDeleteFail> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // 쿼리 작성
      const query = queryRunner.manager
        .createQueryBuilder()
        .update(Posts)
        .set({
          deletedAt: Time.nowDate(),
        })
        .where('id = :postID', { postID: postData.id })
        .andWhere('deletedAt IS NULL')
        .updateEntity(false);

      /**
       * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 3 }, UpdateResult { generatedMaps: [], raw: [], affected: 0 }
       */
      const queryResult = await query.execute();
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
      // 에러
      throw new PostSoftDeleteFail(`service.post.softDeletePost.${!!error.message ? error.message : 'Unknown_Error'}`);
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
  public async addPostViews(viewData: AddPostViewCountDto): Promise<boolean | PostViewCountAddFail> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      /**
       * 해당 아이피가 포스트를 조회한 적 있는지 확인합니다
       */
      const postViewQuery = queryRunner.manager
        .createQueryBuilder()
        .select('postView.id')
        .from(PostView, 'postView')
        .where('postView.postsId = :postID', { postID: viewData.id })
        .andWhere('postView.userIp = :userIP', { userIP: viewData.userIp })
        // getRawOne을 하더라도 실제 쿼리에는 Limit가 걸려있지 않기 때문에 설정합니다.
        .limit(1)
        .maxExecutionTime(1000);

      /**
       * @Returns TextRow { postView_id: '1' } | undefined
       */
      const postViewResult = await postViewQuery.getRawOne();

      // 조회 기록이 있을경우 추가작업을 하지 않습니다.
      if (!!postViewResult) {
        throw new Error('THIS_IP_ALREADY_SEEN_THE_POST');
      }

      /**
       * posts viewCount를 업데이트 하기위해 기존 정보를 조회하고 락을 설정합니다
       */
      const getPostViewCountQuery = queryRunner.manager
        .createQueryBuilder()
        .select('post.viewCounts')
        .from(Posts, 'post')
        .where('post.id = :postID', { postID: viewData.id })
        // getRawOne을 하더라도 실제 쿼리에는 Limit가 걸려있지 않기 때문에 설정합니다.
        .limit(1)
        // LostUpdate 문제로 공유락 -> 쓰기락 변경
        .setLock('pessimistic_write')
        .maxExecutionTime(1000);

      /**
       * @Returns TextRow { post_viewCounts: 3 } | undefined
       */
      const getPostViewCountResult = await getPostViewCountQuery.getRawOne();
      console.log(getPostViewCountResult);

      //  해당하는 포스트를 찾을 수 없을때
      if (!getPostViewCountResult) {
        throw new Error('NOT_FOUND_POST');
      }

      // 현재 조회수를 저장합니다.
      const VIEW_COUNT = getPostViewCountResult.post_viewCounts + 1;

      /**
       * Post 테이블 속성 viewCounts를 업데이트 합니다.
       */
      const updatePostQuery = queryRunner.manager
        .createQueryBuilder()
        .useTransaction(true)
        .update(Posts)
        .set({ viewCounts: VIEW_COUNT })
        .where('id = :postID', { postID: viewData.id })
        .updateEntity(false);

      /**
       * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 3 }, UpdateResult { generatedMaps: [], raw: [], affected: 0 }
       */
      const updatePostQueryResult = await updatePostQuery.execute();

      // 테이블 업데이트가 반영되었는지 확인합니다.
      if (updatePostQueryResult.affected === 0) {
        throw new Error('updatePostQueryResult_AFFECTED_IS_0');
      }

      /**
       * PostView 테이블에 방문 기록을 저장합니다
       */
      const updatePostViewQuery = queryRunner.manager
        .createQueryBuilder()
        .useTransaction(true)
        .insert()
        .into(PostView)
        // postID -> typeORM에서 String->bingInt로 자동 매핑됩니다.
        .values([{ userIp: viewData.userIp, postsId: String(viewData.id), viewedAt: Time.nowDate() }])
        .updateEntity(false);

      /**
       *
       * @Returns InsertResult {
       *   identifiers: [],
       *   generatedMaps: [],
       *   raw: ResultSetHeader {
       *     fieldCount: 0,
       *     affectedRows: 1,
       *     insertId: 2,
       *     info: '',
       *     serverStatus: 3,
       *     warningStatus: 0
       *   }
       * }
       */
      const updatePostViewResult = await updatePostViewQuery.execute();

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
      throw new PostViewCountAddFail(`posts.service.addPostViews.${!!error.message ? error.message : 'Unknown_Error'}`);
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
  public async getPostsFoundByMemberId(getPostData: GetPostsDto): Promise<GetPostsResponseDto | PostGetFail> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      let query = queryRunner.manager
        .createQueryBuilder()
        .select([
          'posts.id',
          'posts.usersId',
          'posts.categoryId',
          'posts.title',
          'posts.thumbNailUrl',
          'posts.viewCounts',
          'posts.likes',
          'posts.private',
          'posts.createdAt',
          'posts.updatedAt',
        ])
        .from(Posts, 'posts')
        // 커서 다음에 있는 게시글이고
        .where('posts.id > :cursorNumber', { cursorNumber: getPostData.cursorNumber })
        // 해당 유저가 작성한
        .andWhere('posts.usersId = :userID', { userID: getPostData.usersId })
        // 삭제되지 않은 게시글만
        .andWhere('posts.deletedAt is NULL')
        // IndexID 오름차순으로 정렬
        .orderBy('posts.id', 'ASC')
        // 최대 반환 게시글 수
        .limit(getPostData.contentLimit)
        .maxExecutionTime(1000);

      // 유저 본인의 요청이 아닌경우
      if (!getPostData.personalRequest) {
        // 비밀글이 아닌 게시글만 검색한다
        query.andWhere('posts.private = 0');
      }

      /**
       * @returns [
       *  Posts {
       *    id: '5',
       *    usersId: 1,
       *    categoryId: 1,
       *    title: 'test',
       *    thumbNailUrl: 'test',
       *    viewCounts: 0,
       *    likes: 0,
       *    private: 0,
       *    createdAt: 2021-11-03T02:04:50.000Z,
       *    updatedAt: 2021-11-03T02:25:44.000Z
       *  },
       *  Posts {
       *    id: '6',
       *    usersId: 1,
       *    categoryId: 1,
       *    title: 'test',
       *    thumbNailUrl: 'test',
       *    viewCounts: 1,
       *    likes: 0,
       *    private: 0,
       *    createdAt: 2021-11-03T02:07:56.000Z,
       *    updatedAt: 2021-11-03T02:25:44.000Z
       *  }
       *]
       */
      const queryResult = await query.getMany();

      // 찾은 포스트가 없다면 에러를 반환합니다.
      if (queryResult.length === 0) {
        throw new Error('POSTS_NOT_FOUND');
      }

      //DTO Mapping
      let response = new GetPostsResponseDto();
      // 포스트 리스트 데이터
      response.postListData = queryResult;
      // 포스트 마지막 데이터의 id를 커서 넘버로 저장
      response.nextCursorNumber = queryResult.length === 0 ? 0 : queryResult[queryResult.length - 1].id;

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();

      // 결과를 리턴합니다
      return response;
    } catch (error) {
      console.log(error);
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      throw new PostGetFail('posts.service.getPostsFoundByMemberId');
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }

  /**
   * 게시글 디테일 정보를 요청합니다
   * - 서비스 요청전 해당 포스트 비밀글, 삭제글 여부를 확인해야합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostDetail(postData: GetPostDetailDto): Promise<GetPostDetailResponseDto | PostDetailGetFail> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      const query = queryRunner.manager
        .createQueryBuilder()
        .select([
          'post.id',
          'post.usersId',
          'post.categoryId',
          'post.title',
          'post.thumbNailUrl',
          'post.viewCounts',
          'post.likes',
          'post.markDownContent',
          'post.private',
          'post.createdAt',
          'post.updatedAt',
          'post.deletedAt',
          'user.userName',
          'user.proFileImageUrl',
          'user.mailAddress',
          'user.admin',
        ])
        .from(Posts, 'post')
        .innerJoin(Users, 'user', 'user.id = post.usersId')
        .where('post.id = :postID', { postID: postData.id })
        .maxExecutionTime(1000);

      /**
       * @Returns TextRow {
       *   post_id: '1',
       *   post_usersID: 1,
       *   post_categoryID: 1,
       *   post_title: 'testTitle',
       *   post_thumbNailURL: 'testurl',
       *   post_viewCounts: 3,
       *   post_likes: 0,
       *   post_markDownContent: 'asd',
       *   post_private: 0,
       *   post_deletedAt 2021-05-05T15:00:00.000Z,
       *   post_createdAt: 2021-05-05T15:00:00.000Z,
       *   post_updatedAt: 2021-11-03T02:29:21.000Z,
       *   user_userName: 'name',
       *   user_proFileImageURL: 'url',
       *   user_mailAddress: 'address',
       *   user_admin: 0
       * }
       * | undefined
       */
      const queryResult = await query.getRawOne();
      // 포스트를 찾지 못했을 경우
      if (!queryResult) {
        throw new Error('POST_NOT_FOUND');
      }

      //DTO Mapping
      let response = new GetPostDetailResponseDto();
      response.id = queryResult.post_id;
      response.usersId = queryResult.post_usersID;
      response.categoryId = queryResult.post_categoryID;
      response.title = queryResult.post_title;
      response.thumbNailUrl = queryResult.post_thumbNailURL;
      response.viewCounts = queryResult.post_viewCounts;
      response.likes = queryResult.post_likes;
      response.markDownContent = queryResult.post_markDownContent;
      response.private = queryResult.post_private;
      response.createdAt = queryResult.post_createdAt;
      response.updatedAt = queryResult.post_updatedAt;
      response.deletedAt = queryResult.post_deletedAt;
      response.userName = queryResult.user_userName;
      response.proFileImageUrl = queryResult.user_proFileImageURL;
      response.mailAddress = queryResult.user_mailAddress;
      response.admin = queryResult.user_admin;

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();

      // 포스트 데이터를 리턴합니다.
      return response;
    } catch (error) {
      console.log(error);
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      // 에러를 반환합니다.
      throw new PostDetailGetFail(`posts.service.getPostDetail.${!!error.message ? error.message : 'Unknown_Error'}`);
    } finally {
      // 생성된 커넥션을 해제합니다.
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
  async setPostToLike(requestData: SetPostToLikeDto): Promise<SetPostToLikeResponseDto | SetPostToLikeFail> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // PostLike 테이블에 기록이 있는지 확인합니다.
      const getPostLikeQuery = queryRunner.manager
        .createQueryBuilder()
        .select('*')
        .from(PostLike, 'postLike')
        .where('postLike.usersId = :userID', { userID: requestData.usersId })
        .andWhere('postLike.postsId = :postID', { postID: requestData.postsId })
        .limit(1)
        .maxExecutionTime(1000);

      /**
       * @returns undefined | TextRow{}
       */
      const getPostLikeResult = await getPostLikeQuery.getRawOne();

      // 유저가 해당 포스트에 '좋아요'를 설정한 기록이 있을경우 에러를 리턴합니다
      if (!!getPostLikeResult) {
        throw new Error('ALREADY_SET_LIKE');
      }
      // Post 테이블의 현재 Like 카운트를 구하고 공유락을 설정합니다
      const getPostQuery = queryRunner.manager
        .createQueryBuilder()
        .select('post.likes')
        .from(Posts, 'post')
        .where('post.id = :postID', { postID: requestData.postsId })
        // 비밀 게시글인 경우 좋아요 기능을 비활성화 합니다.
        .andWhere('post.private = 0')
        // 삭제된 게시글인 경우 좋아요를 등록할 수 없습니다
        .andWhere('post.deletedAt IS NULL')
        .limit(1)
        // LostUpdate 문제로 공유락 -> 쓰기락 변경
        .setLock('pessimistic_write')
        .maxExecutionTime(1000);

      /**
       * @returns TextRow { post_likes: 0 }
       */
      const getPostQueryResult = await getPostQuery.getRawOne();

      // 만족하는 포스트를 찾을 수 없을 경우 에러를 리턴합니다
      if (!getPostQueryResult) {
        throw new Error('POST_NOT_FOUND');
      }

      // 갱신할 카운트를 설정합니다.
      const LIKE_COUNT = getPostQueryResult.post_likes + 1;

      // Post 테이블의 Like 카운트를 업데이트 합니다.
      const setPostQuery = queryRunner.manager
        .createQueryBuilder()
        .update(Posts)
        .set({ likes: LIKE_COUNT })
        .where('id = :postID', { postID: requestData.postsId })
        .updateEntity(false);

      /**
       * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 1 }
       */
      const PostUpdateResult = await setPostQuery.execute();
      console.log(PostUpdateResult);
      // 테이블 업데이트가 반영되었는지 확인합니다
      if (PostUpdateResult.affected === 0) {
        throw new Error('PostUpdateResult_AFFECTED_IS_0');
      }

      // PostLike 테이블에 '좋아요' 기록을 저장합니다.
      const setPostLikeQuery = queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(PostLike)
        .values({ usersId: requestData.usersId, postsId: requestData.postsId, likedAt: Time.nowDate() });

      /**
       * @Returns InsertResult {
       *   identifiers: [ { id: '1' } ],
       *   generatedMaps: [ { id: '1' } ],
       *  raw: ResultSetHeader {
       *     fieldCount: 0,
       *     affectedRows: 1,
       *     insertId: 1,
       *     info: '',
       *     serverStatus: 3,
       *     warningStatus: 0
       *   }
       * }
       */
      const setPostLikeQueryResult = await setPostLikeQuery.execute();
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
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new SetPostToLikeFail(`posts.service.setPostToLike ${!!error.message ? error.message : 'Unknown_Error'}`);
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
  async setPostToDislike(requestData: SetPostToDislikeDto): Promise<SetPostToDislikeResponseDto | SetPostToDislikeFail> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      // PostLike 테이블에 '좋아요' 기록이 있는지 확인합니다.
      const getPostLikeQuery = queryRunner.manager
        .createQueryBuilder()
        .select('*')
        .from(PostLike, 'postLike')
        .where('postLike.usersId = :userID', { userID: requestData.usersId })
        .andWhere('postLike.postsId = :postID', { postID: requestData.postsId })
        .limit(1)
        .maxExecutionTime(1000);

      /**
       * @returns TextRow {
       *   id: '1',
       *   usersID: 1,
       *   postsID: '6',
       *   likedAt: 2021-11-04T08:33:52.000Z
       * } | undefined
       */
      const getPostLikeQueryResult = await getPostLikeQuery.getRawOne();

      // 유저가 '좋아요'를 설정한 기록이 없을경우 에러를 리턴합니다.
      if (!getPostLikeQueryResult) {
        throw new Error('ALREADY_SET_DISLIKE');
      }

      // Post 테이블의 현재 Like 카운트를 구하고 공유락을 설정합니다
      const getPostQuery = queryRunner.manager
        .createQueryBuilder()
        .select('post.likes')
        .from(Posts, 'post')
        .where('post.id = :postID', { postID: requestData.postsId })
        // 비밀 게시글인 경우 좋아요 기능을 비활성화 합니다.
        .andWhere('post.private = 0')
        // 삭제된 게시글인 경우 좋아요를 취소할 수 없습니다
        .andWhere('post.deletedAt IS NULL')
        .limit(1)
        // LostUpdate 문제로 공유락 -> 쓰기락 변경
        .setLock('pessimistic_write')
        .maxExecutionTime(1000);

      /**
       * @returns TextRow { post_likes: 0 }
       */
      const getPostQueryResult = await getPostQuery.getRawOne();

      // 만족하는 포스트를 찾을 수 없을 경우 에러를 리턴합니다
      if (!getPostQueryResult) {
        throw new Error('POST_NOT_FOUND');
      }
      // 갱신할 카운트를 설정합니다.
      const LIKE_COUNT = getPostQueryResult.post_likes - 1;

      // Post 테이블의 Like 카운트를 업데이트 합니다.
      const setPostQuery = queryRunner.manager
        .createQueryBuilder()
        .update(Posts)
        .set({ likes: LIKE_COUNT })
        .where('id = :postID', { postID: requestData.postsId })
        .updateEntity(false);

      /**
       * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 1 }
       */
      const PostUpdateResult = await setPostQuery.execute();

      // 테이블 업데이트가 반영되었는지 확인합니다
      if (PostUpdateResult.affected === 0) {
        throw new Error('PostUpdateResult_AFFECTED_IS_0');
      }

      // PostLike 테이블의 '좋아요' 기록을 삭제합니다.
      const deletePostLikeQuery = queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PostLike)
        .where('usersId = :userID', { userID: requestData.usersId })
        .andWhere('postsId = :postID', { postID: requestData.postsId });

      /**
       * @returns DeleteResult { raw: [], affected: 1 }
       */
      const deletePostLikeQueryResult = await deletePostLikeQuery.execute();

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

      // 에러 반환
      throw new SetPostToDislikeFail(`posts.service.setPostToLike ${!!error.message ? error.message : 'Unknown_Error'}`);
    } finally {
      // 커넥션 해제
      await queryRunner.release();
    }
  }
}
