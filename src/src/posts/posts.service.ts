import { Injectable } from '@nestjs/common';
import { Posts } from '../entities/Posts';
import { PostCreateFail, PostUpdateFail, PostWriterNotFound } from '../ExceptionFilters/Errors/Posts/Post.error';
import { Connection } from 'typeorm';
import { GetPostWriterDto, GetPostWriterResponseDto } from './dto/Services/GetPostWriter.DTO';
import { CreatePostDto } from './dto/Services/CreatePost.DTO';
import Time from '../utilities/Time.utility';
import { UpdatePostDto } from './dto/Services/UpdatePost.DTO';
import { timeLog } from 'console';

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
  public async softDeletePost() {}

  /**
   * 포스트 조회수를 +1 합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async addPostViews() {}

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
