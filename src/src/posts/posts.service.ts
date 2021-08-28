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
  // 게시글 수정
  public modifyPostByPostID(personalRequest: boolean, postID: number, categoryID: number, title: string, thumbnailURL: string, markDownContent: string, isPrivate: boolean) {}
  // 게시글 리스트 리턴
  public getPostsByUserID(personalRequest: boolean, userID: number, cursorNumber: number, contentLimit: number) {}
  // 게시글 상세보기
  public getPostDetailByPostID(personalRequest: boolean, postID: number) {}
  // 게시글 삭제
  public softDeletePostByPostID(personalRequest: boolean, postID: number) {}
}
