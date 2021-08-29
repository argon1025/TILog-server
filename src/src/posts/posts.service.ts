import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { getConnection, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
        .values([{ usersId: userID, categoryId: categoryID, title: title, thumbNaillUrl: thumbnailURL, markDownContent: markDownContent, private: isPrivate, createdAt: NOW_DATE }])
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
   * @returns Promise<boolean>
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
        .set({ categoryId: categoryID, title: title, thumbNaillUrl: thumbnailURL, markDownContent: markDownContent, private: isPrivate, updatedAt: NOW_DATE })
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
  // 게시글 리스트 리턴
  public getPostsByUserID(personalRequest: boolean, userID: number, cursorNumber: number, contentLimit: number) {}
  // 게시글 상세보기
  public getPostDetailByPostID(personalRequest: boolean, postID: number) {}

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
