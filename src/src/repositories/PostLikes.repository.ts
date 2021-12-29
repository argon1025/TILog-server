import { EntityRepository, AbstractRepository, UpdateResult, InsertResult, DeleteResult } from 'typeorm';
import { PostLike } from '../entities/PostLike';

@EntityRepository(PostLike)
export class PostLikesRepository extends AbstractRepository<PostLike> {
  /**
   * 특정 유저가 특정 포스트에 좋아요를 누른 기록을 조회합니다
   * @param postId
   * @param userId
   * @returns
   */
  public findOneByPostIdAndUserId(postId: string, userId: number): Promise<PostLike> {
    return this.repository
      .createQueryBuilder('PostLike')
      .select(['PostLike.id', 'PostLike.likedAt'])
      .where('PostLike.usersId = :userId', { userId: userId })
      .andWhere('PostLike.postsId = :postId', { postId: postId })
      .maxExecutionTime(1000)
      .getOne();
  }

  /**
   * 좋아요 기록을 생성합니다
   * @param postId
   * @param userId
   * @param likedAt
   * @returns
   */
  public create(postId: string, userId: number, likedAt: string): Promise<InsertResult> {
    return this.repository.createQueryBuilder('PostLike').insert().values({ usersId: userId, postsId: postId, likedAt: likedAt }).execute();
  }

  /**
   * 특정 포스트의 특정 유저가 생성한 좋아요 기록을 삭제합니다
   * @param postId
   * @param userId
   * @returns
   */
  public delete(postId: string, userId: number): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder('PostLike')
      .delete()
      .where('PostLike.usersId = :userId', { userId: userId })
      .andWhere('PostLike.postsId = :postId', { postId: postId })
      .execute();
  }
}
