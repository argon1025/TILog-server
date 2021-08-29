import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { getConnection, Repository } from 'typeorm';
import { PostDetailDto } from './dto/Posts.Detail.DTO';
import { PostsListDto } from './dto/Posts.List.DTO';

@Injectable()
export class PostsService {
  constructor() {}

  // 게시글 생성
  public async createPost(userID: number, categoryID: number, title: string, thumbnailURL: string, markDownContent: string, isPrivate: boolean | number) {
    // 생성일자 반환
    const NOW_DATE = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // Mysql TinyInt로 Boolean타입 변환
    isPrivate = isPrivate ? 1 : 0;

    // 새 커넥션과 쿼리 러너 생성
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .useTransaction(true)
        // .setLock('pessimistic_write')
        .insert()
        .into(Posts)
        .values([{ usersId: userID, categoryId: categoryID, title: title, thumbNailUrl: thumbnailURL, markDownContent: markDownContent, private: isPrivate, createdAt: NOW_DATE }])
        .updateEntity(false)
        .execute();

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }

  /**
   * 게시글 수정
   * @param personalRequest
   * @param postID
   * @param categoryID
   * @param title
   * @param thumbnailURL
   * @param markDownContent
   * @param isPrivate
   * @returns
   *
   * 1. 사용자 본인의 요청인지 확인합니다.-> 향후 해당 로직을 컨트롤러로 분리할 수 있습니다.
   * 2. 게시글을 수정합니다.
   *
   */
  public async modifyPostByPostID(personalRequest: boolean, postID: number, categoryID: number, title: string, thumbnailURL: string, markDownContent: string, isPrivate: boolean | number) {
    // 사용자 본인의 요청인지 확인합니다.
    if (!personalRequest) {
      return false;
    }
    // 생성일자 반환
    const NOW_DATE = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // Mysql TinyInt로 Boolean타입 변환
    isPrivate = isPrivate ? 1 : 0;

    // 새 커넥션과 쿼리 러너객체를 생성합니다
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // 데이터 베이스에 연결합니다
    await queryRunner.connect();

    // 트랜잭션을 시작합니다.
    await queryRunner.startTransaction();

    try {
      // 쿼리빌더를 통해 UPDATE 구문을 실행합니다.
      await queryRunner.manager
        .createQueryBuilder()
        .useTransaction(true)
        .update(Posts)
        .set({ categoryId: categoryID, title: title, thumbNailUrl: thumbnailURL, markDownContent: markDownContent, private: isPrivate, updatedAt: NOW_DATE })
        .where('id = :postID', { postID: postID })
        .updateEntity(false)
        .execute();

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }
  /**
   * 유저 게시글 조회
   * @param personalRequest
   * @param userID
   * @param cursorNumber
   * @param contentLimit
   * @returns
   *
   * 커서 기반으로 구현되어 있습니다.
   * 해당 펑션은 Posts의 IndexID가 생성일 순으로 지정되어 있다는 가정하에 작성되었습니다
   * 향후 다양한 정렬옵션을 사용하고자 한다면 커스텀 커서 페이지네이션으로 함수를 다시 작성해야합니다.
   *
   * 1. QueryBuilder를 사용해 질의를 작성합니다.
   * 2. 본인이 아닐경우 비밀 게시글을 숨기는 조건을 추가합니다
   * 3. 질의 결과와 다음 cursorNumber를 반환합니다
   *
   */
  public async getPostsByUserID(personalRequest: boolean, userID: number, cursorNumber: number, contentLimit: number): Promise<PostsListDto | boolean> {
    // 새 커넥션과 쿼리 러너객체를 생성합니다
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // 데이터 베이스에 연결합니다
    await queryRunner.connect();

    // 트랜잭션을 시작합니다.
    await queryRunner.startTransaction();

    try {
      // 결과를 저장할 변수를 생성합니다.
      let queryResult: Posts[];
      // 쿼리를 작성합니다
      let query = queryRunner.manager
        .createQueryBuilder()
        .useTransaction(true)
        .select('postTable.id')
        .addSelect('postTable.usersID')
        .addSelect('postTable.categoryID')
        .addSelect('postTable.title')
        .addSelect('postTable.thumbNailURL')
        .addSelect('postTable.viewCounts')
        .addSelect('postTable.likes')
        .addSelect('postTable.markDownContent')
        .addSelect('postTable.private')
        .addSelect('postTable.createdAt')
        .addSelect('postTable.updatedAt')
        // 질의할 테이블과 별칭 설정
        .from(Posts, 'postTable')
        // cursorNumber 다음의 열
        .where('postTable.id > :cursorNumber', { cursorNumber: cursorNumber })
        // 해당 유저 아이디의
        .andWhere('postTable.usersID = :userID', { userID: userID })
        // 소프트 딜리트가 되지 않은 게시글
        .andWhere('postTable.deletedAt is NULL')
        // IndexID 오름차순으로 정렬
        .orderBy('postTable.id', 'ASC')
        // 최대 반환 열 갯수
        .limit(contentLimit);

      // 본인이 아닐경우 비밀게시글 조건을 추가합니다.
      if (!personalRequest) {
        query = query
          // 비밀 게시글이 아닌
          .andWhere('postTable.private = 0');
      }

      // 질의를 한뒤 결과를 저장합니다
      queryResult = await query.getMany();

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();

      // DTO에 맞게 리턴 데이터를 정의합니다
      let result: PostsListDto = {
        postListData: [...queryResult],
        nextCursorNumber: queryResult.length != 0 ? +queryResult[queryResult.length - 1].id : 0,
      };

      // [임시] 디버깅
      console.log(result);

      return result;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }

  /**
   * 게시글 디테일 뷰
   * @param personalRequest
   * @param postID
   *
   * 1. QueryBuilder를 사용해 질의를 작성합니다.
   * 2. 본인이 아닐경우 비밀 게시글을 숨기는 조건을 추가합니다
   * 3. 질의 결과와를 반환합니다
   *
   */
  public async getPostDetailByPostID(personalRequest: boolean, postID: number): Promise<PostDetailDto | boolean> {
    // 새 커넥션과 쿼리 러너객체를 생성합니다
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // 데이터 베이스에 연결합니다
    await queryRunner.connect();

    // 트랜잭션을 시작합니다.
    await queryRunner.startTransaction();

    try {
      // 결과를 저장할 변수를 생성합니다.
      let queryResult: Posts;
      // 쿼리를 작성합니다
      let query = queryRunner.manager
        .createQueryBuilder()
        .useTransaction(true)
        .select('postTable.id')
        .addSelect('postTable.usersId')
        .addSelect('postTable.categoryId')
        .addSelect('postTable.title')
        .addSelect('postTable.thumbNailUrl')
        .addSelect('postTable.viewCounts')
        .addSelect('postTable.likes')
        .addSelect('postTable.markDownContent')
        .addSelect('postTable.private')
        .addSelect('postTable.createdAt')
        .addSelect('postTable.updatedAt')
        // 질의할 테이블과 별칭 설정
        .from(Posts, 'postTable')
        // 해당 유저 아이디의
        .where('postTable.id = :postID', { postID: postID })
        // 소프트 딜리트가 되지 않은 게시글
        .andWhere('postTable.deletedAt is NULL');

      // 본인이 아닐경우 비밀게시글 조건을 추가합니다.
      if (!personalRequest) {
        query = query
          // 비밀 게시글이 아닌
          .andWhere('postTable.private = 0');
      }

      // 질의를 한뒤 결과를 저장합니다
      queryResult = await query.getOne();

      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();

      // DTO에 맞게 리턴 데이터를 정의합니다
      let result: PostDetailDto = queryResult;

      // [임시] 디버깅
      console.log(result);

      return result;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }

  /**
   * 게시글 삭제
   * @param personalRequest
   * @param postID
   * @returns Promise<boolean>
   *
   * 1. 사용자 본인의 요청인지 확인합니다.-> 향후 해당 로직을 컨트롤러로 분리할 수 있습니다.
   * 2. deleteAt 컬럼에 데이터를 추가합니다
   *
   */
  public async softDeletePostByPostID(personalRequest: boolean, postID: number) {
    // 사용자 본인의 요청인지 확인합니다.
    if (!personalRequest) {
      return false;
    }

    // 오늘 날자 반환
    const NOW_DATE = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 새 커넥션과 쿼리 러너객체를 생성합니다
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // 데이터 베이스에 연결합니다
    await queryRunner.connect();

    // 트랜잭션을 시작합니다.
    await queryRunner.startTransaction();

    try {
      // 쿼리빌더를 통해 softDelete 구문을 실행합니다.
      await queryRunner.manager.createQueryBuilder().useTransaction(true).update(Posts).set({ deletedAt: NOW_DATE }).where('id = :postID', { postID: postID }).updateEntity(false).execute();
      // 변경 사항을 커밋합니다.
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // 롤백을 실행합니다.
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }
}
