import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { PostWriterNotFound } from 'src/ExceptionFilters/Errors/Posts/Post.error';
import { Connection, Repository } from 'typeorm';
import { GetPostWriterDto, GetPostWriterResponseDto } from './dto/Services/GetPostWriter.DTO';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Posts) private postsRepository: Repository<Posts>, private connection: Connection) {}

  /**
   * 포스트 작성자를 조회합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostWriterId(getPostWriterData: GetPostWriterDto): Promise<GetPostWriterResponseDto | PostWriterNotFound> {
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
        .where('postTable.id = :postId', { postId: getPostWriterData.id });

      /**
       * @Returns Posts { usersId: 1 }
       */
      const queryResult = await query.getOneOrFail();

      // DTO Mapping
      let resultData = new GetPostWriterResponseDto();
      resultData.usersId = queryResult.usersId;

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

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
  public async createPost() {}

  /**
   * 포스트를 수정 합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async updatePost() {}

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
