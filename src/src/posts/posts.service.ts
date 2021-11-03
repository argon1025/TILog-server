import { Injectable } from '@nestjs/common';
import { Posts } from '../entities/Posts';
import {
  PostCreateFail,
  PostSoftDeleteFail,
  PostUpdateFail,
  PostViewCountAddFail,
  PostWriterNotFound,
} from '../ExceptionFilters/Errors/Posts/Post.error';
import { Connection } from 'typeorm';
import { GetPostWriterDto, GetPostWriterResponseDto } from './dto/Services/GetPostWriter.DTO';
import { CreatePostDto } from './dto/Services/CreatePost.DTO';
import Time from '../utilities/Time.utility';
import { UpdatePostDto } from './dto/Services/UpdatePost.DTO';
import { timeLog } from 'console';
import { SoftDeletePostDto } from './dto/Services/SoftDeletePost.DTO';
import { AddPostViewCountDto } from './dto/Services/AddPostViewCount.DTO';
import { PostView } from 'src/entities/PostView';

@Injectable()
export class PostsService {
  constructor(private connection: Connection) {}

  /**
   * 포스트 작성자를 조회합니다
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
        .select('postTable.usersId')
        .from(Posts, 'postTable')
        .where('postTable.id = :postId', { postId: postWriterData.id })
        .maxExecutionTime(1000);

      /**
       * @Returns Posts { usersId: 1 }
       */
      const queryResult = await query.getOneOrFail();

      // DTO Mapping
      let resultData = new GetPostWriterResponseDto();
      resultData.usersId = queryResult.usersId;

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // return
      return resultData;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 에러
      throw new PostWriterNotFound('service.post.getPostWriter 에러입니다.');
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
  public async createPost(postData: CreatePostDto) {
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
       * @Returns Posts InsertResult {
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

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
      // return
      return true;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 에러
      throw new PostCreateFail('service.post.createPost 에러입니다.');
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
  public async updatePost(postData: UpdatePostDto) {
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
      // console.log(queryResult);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
      // return
      return true;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 에러
      throw new PostUpdateFail('service.post.updatePost 에러입니다.');
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
  public async softDeletePost(postData: SoftDeletePostDto) {
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
        .updateEntity(false);

      /**
       * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 3 }, UpdateResult { generatedMaps: [], raw: [], affected: 0 }
       */
      const queryResult = await query.execute();
      // 수정된 사항이 없을경우
      if (queryResult.affected === 0) {
        throw new Error('affected is 0');
      }
      // console.log(queryResult);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
      // return
      return true;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      // 에러
      throw new PostSoftDeleteFail('service.post.softDeletePost 에러입니다.');
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
  public async addPostViews(viewData: AddPostViewCountDto) {
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
        .limit(1);

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
        // 공유락
        .setLock('pessimistic_read');

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
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      throw new PostViewCountAddFail(`posts.service.addPostViews ${error.message}`);
    } finally {
      // 데이터베이스 커넥션 해제
      await queryRunner.release();
    }
  }

  /**
   * 특정 멤버가 작성한 게시글 리스트를 요청합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostsFoundByMemberId() {}

  /**
   * 게시글 디테일 정보를 요청합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostDetail() {}
}
