import { EntityRepository, AbstractRepository, UpdateResult, InsertResult } from 'typeorm';
import { PostView } from '../entities/PostView';

@EntityRepository(PostView)
export class PostViewsRepository extends AbstractRepository<PostView> {
  /**
   * 특정 IP가 특정 PostId를 열람한 기록이 있는지 조회합니다
   * @param postId
   * @param userIp
   * @Returns TextRow { postView_id: '1' } | undefined
   */
  findOneByPostIdAndUserIp(postId: string, userIp: string): Promise<PostView> {
    return this.repository
      .createQueryBuilder('PostView')
      .select(['postView.id', 'postView.viewedAt'])
      .where('PostView.postsId = :postID', { postID: postId })
      .andWhere('PostView.userIp = :userIP', { userIP: userIp })
      .maxExecutionTime(1000)
      .getOne();
    // getRawOne을 하더라도 실제 쿼리에는 Limit가 걸려있지 않기 때문에 설정합니다.
    //.limit(1)
  }

  /**
   * 포스트 열람 기록을 생성합니다
   * @param userIp
   * @param postId
   * @param viewedAt
   * @returns InsertResult {
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
   */
  create(userIp: string, postId: string, viewedAt: string): Promise<InsertResult> {
    return this.repository
      .createQueryBuilder('PostView')
      .insert()
      .values([{ userIp: userIp, postsId: postId, viewedAt: viewedAt }])
      .updateEntity(false)
      .execute();
  }
}
