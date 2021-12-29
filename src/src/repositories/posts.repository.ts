import { Category } from 'src/entities/Category';
import { PostsTags } from 'src/entities/PostsTags';
import { Tags } from 'src/entities/Tags';
import { UserblogCustomization } from 'src/entities/UserblogCustomization';
import { Users } from 'src/entities/Users';
import { EntityRepository, AbstractRepository, InsertResult, UpdateResult } from 'typeorm';
import { Posts } from '../entities/Posts';

@EntityRepository(Posts)
export class PostRepository extends AbstractRepository<Posts> {
  /**
   * 게시글 유저아이디, 비밀글 여부, 생성일, 업데이트일, 삭제일을 찾아 반환합니다.
   * @param postId
   * @returns  Posts { usersId: 1, private: 0, createdAt: null, updatedAt: null, deletedAt: null  } | undefined
   */
  public accessInfoFindOneOrFailByPostId(postId: string): Promise<Posts> {
    return this.repository
      .createQueryBuilder('Post')
      .select(['Post.usersId', 'Post.private', 'Post.createdAt', 'Post.updatedAt', 'Post.deletedAt'])
      .where('Post.id = :postId', { postId: postId })
      .maxExecutionTime(1000)
      .getOneOrFail();
  }

  /**
   * 포스트를 생성합니다
   * @param userId
   * @param categoryId
   * @param title
   * @param thumbNailURL
   * @param content
   * @param isPrivate
   * @param nowTime
   * @returns InsertResult {
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
  public create(userId: number, categoryId: number, title: string, thumbNailURL: string, content: string, isPrivate: number, nowTime: string): Promise<InsertResult> {
    return this.repository
      .createQueryBuilder('Post')
      .insert()
      .values([
        {
          usersId: userId,
          categoryId: categoryId,
          title: title,
          thumbNailUrl: thumbNailURL,
          markDownContent: content,
          private: isPrivate,
          createdAt: nowTime,
        },
      ])
      .updateEntity(false)
      .execute();
  }

  /**
   * 포스트를 수정합니다
   * @param postId
   * @param categoryId
   * @param title
   * @param thumbNailURL
   * @param content
   * @param isPrivate
   * @param updatedAt
   * @Returns { generatedMaps: [], raw: [], affected: 1, } || UpdateResult { generatedMaps: [], raw: [], affected: 0 }
   */
  public modifyById(
    postId: string,
    categoryId: number,
    title: string,
    thumbNailURL: string,
    content: string,
    isPrivate: number,
    updatedAt: string,
  ): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        categoryId: categoryId,
        title: title,
        thumbNailUrl: thumbNailURL,
        markDownContent: content,
        private: isPrivate,
        updatedAt: updatedAt,
      })
      .where('id = :postId', { postId: postId })
      .updateEntity(false)
      .execute();
  }

  /**
   * 포스트를 삭제합니다
   * @param postId
   * @param deletedAt
   * @Returns UpdateResult { generatedMaps: [], raw: [], affected: 3 } || UpdateResult { generatedMaps: [], raw: [], affected: 0 }
   */
  public softDeleteById(postId: string, deletedAt: string): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        deletedAt: deletedAt,
      })
      .where('id = :postID', { postID: postId })
      .andWhere('deletedAt IS NULL')
      .updateEntity(false)
      .execute();
  }

  /**
   * 특정 포스트의 뷰 카운트를 변경합니다
   * @param postId
   * @param viewCount
   */
  public modifyViewCountById(postId: string, viewCount: number): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder('Post')
      .update()
      .set({ viewCounts: viewCount })
      .where('Post.id = :postID', { postID: postId })
      .updateEntity(false)
      .execute();
  }

  public modifyLikeCountById(postId: string, likeCount: number): Promise<UpdateResult> {
    return this.repository.createQueryBuilder('Post').update().set({ likes: likeCount }).where('id = :postId', { postId: postId }).updateEntity(false).execute();
  }

  /**
   * 특정 유저의 포스트 리스트를 조회합니다
   * @param userId
   * @param cursor
   * @param rowLimit
   * @param onlyPublicPost
   * @param orderBy
   * @returns Posts[{ id: "16", usersId: 1, categoryId: 1,title: "Title example",thumbNailUrl: "thumbNailUrl.com",viewCounts: 0,private: 0,createdAt: {},updatedAt: {},}]
   */
  public findManyByUserId(userId: number, cursor: number, rowLimit: number, onlyPublicPost: boolean, orderBy: 'ASC' | 'DESC'): Promise<Posts[]> {
    let queryBuilder = this.repository
      .createQueryBuilder('Post')
      .select([
        'Post.id',
        'Post.usersId',
        'Post.categoryId',
        'Post.title',
        'Post.thumbNailUrl',
        'Post.viewCounts',
        'Post.private',
        'Post.createdAt',
        'Post.updatedAt',
        'Post.title',
        'Post.title',
        'Category.id',
        'Category.categoryName',
        'Category.iconUrl',
      ])
      .innerJoin(Category, 'Category', 'Post.categoryId = Category.id')
      // 커서 다음에 있는 게시글
      .where('Post.id > :cursorNumber', { cursorNumber: cursor })
      // 해당 유저가 작성한
      .andWhere('Post.usersId = :userId', { userId: userId })
      // 삭제되지 않은 게시글
      .andWhere('Post.deletedAt is NULL')
      // IndexID 정렬
      .orderBy('Post.id', orderBy)
      // 최대 반환 게시글 수
      .limit(rowLimit)
      // 요청 대기 시간
      .maxExecutionTime(1000);

    // 퍼블릭 포스트만 조회할 경우
    if (onlyPublicPost) {
      queryBuilder.andWhere('Post.private = 0');
    }

    return queryBuilder.getMany();
  }

  /**
   * 특정 포스트 아이디로 포스트정보, 블로그 정보, 카테고리 정보, 태그정보를 조회합니다
   * @param postId
   * @returns 
{
  id: "16",
  usersId: 1,
  title: "Title example",
  thumbNailUrl: "thumbNailUrl.com",
  viewCounts: 0,
  likes: 0,
  markDownContent: "markDownContent Example",
  private: 0,
  createdAt: {
  },
  updatedAt: {
  },
  deletedAt: null,
  users: {
    id: 1,
    oAuthType: "github",
    oAuthServiceId: "s",
    userName: "test",
    proFileImageUrl: "url.com",
    mailAddress: null,
    password: null,
    accessToken: "token",
    createdAt: "date",
    updatedAt: null,
    deletedAt: null,
    admin: 0,
    userblogCustomization: null|{...userblogCustomization}},
  },
  category: {
    id: 1,
    categoryName: "미지정",
    iconUrl: null,
  },
  postsTags: [
    {
      id: "1",
      postsId: "16",
      tagsId: "1",
      createdAt: {
      },
      tags: {
        id: "1",
        tagsName: "1태그",
        createdAt: {
        },
      },
    },
    {
      id: "2",
      postsId: "16",
      tagsId: "2",
      createdAt: {
      },
      tags: {
        id: "2",
        tagsName: "2태그",
        createdAt: {
        },
      },
    },
    {
      id: "3",
      postsId: "16",
      tagsId: "3",
      createdAt: {
      },
      tags: {
        id: "3",
        tagsName: "3태그",
        createdAt: {
        },
      },
    },
  ],
}
   */
  public findOneById(postId: string): Promise<Posts> {
    return (
      this.repository
        .createQueryBuilder('Post')
        .select([
          'Post.id',
          'Post.usersId',
          'Post.title',
          'Post.thumbNailUrl',
          'Post.viewCounts',
          'Post.likes',
          'Post.markDownContent',
          'Post.private',
          'Post.createdAt',
          'Post.updatedAt',
          'Post.deletedAt',
          'User.userName',
          'User.proFileImageUrl',
          'User.mailAddress',
          'User.admin',
          'UserblogCustomization.blogTitle',
          'UserblogCustomization.statusMessage',
          'UserblogCustomization.selfIntroduction',
          'category.id',
          'category.categoryName',
          'category.iconUrl',
        ])

        //.innerJoin('Post.users', 'User')
        .innerJoinAndSelect('Post.users', 'User')
        .leftJoinAndSelect('User.userblogCustomization', 'userblogCustomization')
        .innerJoin('Post.category', 'category')
        .leftJoinAndSelect('Post.postsTags', 'postsTags')
        .leftJoinAndSelect('postsTags.tags', 'tag')
        .where('Post.id = :postId', { postId: postId })
        .maxExecutionTime(1000)
        .getOne()
    );
  }

  /**
   * 특정 포스트의 뷰카운트를 요청합니다, 수정하기위해 락 상태로 요청할 수 있습니다
   * @param postId
   * @param setRock
   * @param rockMode
   */
  public getAndModifyViewCountById(
    postId: string,
    setRock: boolean = true,
    rockMode:
      | 'pessimistic_read'
      | 'pessimistic_write'
      | 'dirty_read'
      | 'pessimistic_partial_write'
      | 'pessimistic_write_or_fail'
      | 'for_no_key_update' = 'pessimistic_write',
  ): Promise<Posts> {
    let queryBuilder = this.repository
      .createQueryBuilder('Post')
      .select('Post.viewCounts')
      .where('Post.id = :postId', { postId: postId })
      .maxExecutionTime(1000)
      .limit(1);

    if (setRock) {
      queryBuilder
        .limit(1)
        // LostUpdate 문제로 공유락 -> 쓰기락 변경
        .setLock(rockMode);
    }

    return queryBuilder.getOne();
  }

  /**
   * 특정 포스트의 라이크 카운트를 요청합니다, 수정하기위해 락 상태를 요청할 수 있습니다.
   * @param postId
   * @param setRock
   * @param rockMode
   * @returns
   */
  public getAndModifyLikeCountById(
    postId: string,
    setRock: boolean = true,
    rockMode:
      | 'pessimistic_read'
      | 'pessimistic_write'
      | 'dirty_read'
      | 'pessimistic_partial_write'
      | 'pessimistic_write_or_fail'
      | 'for_no_key_update' = 'pessimistic_write',
  ): Promise<Posts> {
    let queryBuilder = this.repository
      .createQueryBuilder('Post')
      .select('Post.likes')
      .where('Post.id = :postId', { postId: postId })
      // 비밀 게시글인 경우 좋아요 기능을 비활성화 합니다.
      .andWhere('Post.private = 0')
      // 삭제된 게시글인 경우 좋아요를 등록할 수 없습니다
      .andWhere('Post.deletedAt IS NULL')
      .maxExecutionTime(1000);

    if (setRock) {
      // LostUpdate 문제로 공유락 -> 쓰기락 변경
      queryBuilder.setLock(rockMode);
    }

    return queryBuilder.getOne();
  }
}
