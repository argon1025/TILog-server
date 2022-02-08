import { searchScope } from 'src/posts/dto/Services/MostLikedPost.DTO';
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
  public create(
    userId: number,
    categoryId: number,
    title: string,
    thumbNailURL: string,
    content: string,
    isPrivate: number,
    nowTime: string,
  ): Promise<InsertResult> {
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
      .where('id = :postID', { postID: postId })
      .updateEntity(false)
      .execute();
  }

  public modifyLikeCountById(postId: string, likeCount: number): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder('Post')
      .update()
      .set({ likes: likeCount })
      .where('id = :postId', { postId: postId })
      .updateEntity(false)
      .execute();
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
  public findManyByUserId(userId: number, cursor: number = 0, rowLimit: number, onlyPublicPost: boolean, orderBy: 'ASC' | 'DESC'): Promise<Posts[]> {
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
        'Post.likes',
        'Category.id',
        'Category.categoryName',
        'Category.iconUrl',
      ])
      .innerJoin('Post.category', 'Category')
      // 해당 유저가 작성한
      .where('Post.usersId = :userId', { userId: userId })
      // 삭제되지 않은 게시글
      .andWhere('Post.deletedAt is NULL')
      // IndexID 정렬
      .orderBy('Post.id', orderBy)
      // 최대 반환 게시글 수
      .limit(rowLimit)
      // 요청 대기 시간
      .maxExecutionTime(1000);

    // 커서가 기본값으로 요청되지 않았을 경우 조건절이 추가됩니다
    if (cursor != 0) {
      // 내림차순(DESC)로 정렬 시 cursor 값 보다 작은 인덱스 ID를 가지는 포스트만 조회합니다
      // 오름차순(ASC)로 정렬 시 cursor값 보다 큰 인덱스 ID를 가지는 포스트만 조회합니다
      queryBuilder.andWhere(orderBy === 'ASC' ? 'Post.id > :cursorNumber' : 'Post.id < :cursorNumber', {
        cursorNumber: cursor,
      });
    }

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

  /**
   * 최근 인기 게시글을 가져옵니다
   * @TODO 쿼리빌더로 변환 필요합니다
   * @TODO 서브쿼리에서 커서인덱스를 생성함, 캐시 업데이트 주기가 길기 떄문에 오프셋이랑 별 차이가 없음
   * @param requestData
   * @returns MostLikedResponseDto
   */
  public getTrend(requestData: { cursor: number; dateScope: searchScope; rowLimit: number }) {
    /*
    return (
      this.repository
        .createQueryBuilder('Post')
        .select([
          'Post.id',
          'Post.usersId',
          'Post.categoryId',
          'Post.title',
          'Post.thumbNailUrl',
          'Post.viewCounts',
          'Post.likes',
          'Post.private',
          'Post.createdAt',
          'Post.updatedAt',
          'Category.id',
          'Category.categoryName',
          'Category.iconUrl',
          'User.userName',
          'User.proFileImageUrl',
        ])
        .innerJoin('Post.category', 'Category')
        .innerJoin('Post.users', 'User')
        // 커서 다음에 있는 게시글이고
        .where('Post.id > :cursorNumber', { cursorNumber: requestData.cursor })
        // 해당 날자 안에
        .andWhere(`Post.createdAt BETWEEN DATE_ADD(NOW(), INTERVAL -1 ${requestData.dateScope}) AND NOW()`)
        // 삭제되지 않은 게시글만
        .andWhere('Post.deletedAt is NULL')
        // 비밀글이 아닌것만
        .andWhere('Post.private = 0')
        // 좋아요 높은 순으로 정렬
        .orderBy('Post.likes', 'DESC')
        // 최대 반환 게시글 수
        .limit(requestData.rowLimit)
        .maxExecutionTime(1000)
        .getMany()
    );*/

    const query = this.repository.query(
      `SELECT postList.*, users.userName, users.proFileImageURL, category.categoryName, category.iconURL FROM (SELECT @ROWNUM:=@ROWNUM+1 AS cursor_num, posts.id as postId, posts.title as postTitle,posts.thumbNailURL as thumbNailURL, posts.viewCounts as postViewCounts, posts.likes as postLikes, posts.createdAt as createdAt, posts.usersID as usersID, posts.categoryID as categoryID FROM (SELECT @rownum:=0) TMP, posts WHERE posts.createdAt BETWEEN DATE_ADD(NOW(), INTERVAL -1 ${requestData.dateScope}) AND NOW() AND posts.deletedAt is NULL AND posts.private = 0 ORDER BY posts.likes DESC, posts.id ASC) as postList INNER JOIN users ON postList.usersID = users.id INNER JOIN category ON postList.categoryID = category.id WHERE postList.cursor_num > ${requestData.cursor}  LIMIT ${requestData.rowLimit}`,
    );

    return query;
  }
}
