import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Repository } from 'typeorm/repository/Repository';
import { WriteNewCommentOnPostDTO } from './dto/service/writeNewCommentOnPost.dto';
import { WriteNewCommentToCommentDTO } from './dto/service/writeNewCommentToComment.dto';
import Time from '../utilities/time.utility';
import { Connection, getRepository } from 'typeorm';
import {
  CommentWriteFailed,
  DeleteCommentsFaild,
  CommentToCommentWriteFailed,
  UpdateCommentsFaild,
  ViewPostCommentsFaild,
  DisableLevel,
} from 'src/ExceptionFilters/Errors/Comments/Comment.error';
import { Users } from 'src/entities/Users';
@Injectable()
export class CommentsService {
  constructor(private connection: Connection, @InjectRepository(Comments) private commentsRepo: Repository<Comments>) {}

  /**
   * write New comment on post
   * 포스트에 새로운 코멘트를 작성합니다.
   * @returns Comments
   * Revert
   * no contents
   * no postID
   */
  async writeNewCommentOnPost(reqData: WriteNewCommentOnPostDTO): Promise<Comments> {
    try {
      const { userID, postID, contents } = reqData;
      return await this.commentsRepo.save({
        usersId: 6,
        postsId: postID,
        htmlContent: contents,
        createdAt: Time.nowDate(),
      });
    } catch (error) {
      // 에러 생성
      throw new CommentWriteFailed(`service.comments.writenewcommentonpost.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * vaildate comment level
   * 코멘트의 레벨을 검증합니다.
   * @returns boolean
   */
  async vaildateCommentLevel(commentID: string): Promise<void> {
    try {
      const { replyLevel } = await this.commentsRepo.findOne({
        id: commentID,
      });
      if (replyLevel) throw new Error('답글을 더이상 작성할 수 없습니다.');
    } catch (error) {
      // 에러 생성
      throw new DisableLevel(`service.comment.vaildateCommentLevel.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   *  write new comment to comment
   *  답글 작성를 작성합니다.
   */
  async writeNewCommentToComment(reqData: WriteNewCommentToCommentDTO): Promise<Comments> {
    try {
      const { userID, postID, contents, replyLevel, replyTo } = reqData;
      // 답글의 레벨 검증
      await this.vaildateCommentLevel(replyTo);
      // 답글 저장
      return await this.commentsRepo.save({
        usersId: 5,
        postsId: postID,
        htmlContent: contents,
        replyTo: replyTo,
        replyLevel: replyLevel,
        createdAt: Time.nowDate(),
      });
    } catch (error) {
      // 에러 생성
      throw new CommentToCommentWriteFailed(`service.comment.writnewcommenttocomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  // level 0 인 코멘트 가져오기
  async viewAllComments(postID: string): Promise<Array<Comments>> {
    // 쿼리러너 객체 생성
    const queryRunner = this.connection.createQueryRunner();

    // 데이터 베이스 연결
    await queryRunner.connect();

    // 트랜잭션 시작
    await queryRunner.startTransaction();
    try {
      const query = await queryRunner.manager
        .createQueryBuilder()
        .select([
          'c.id',
          'c.postsId',
          'c.htmlContent',
          'c.replyTo',
          'c.replyLevel',
          'c.createdAt',
          'c.updatedAt',
          'c.deletedAt',
          'c.usersId',
          'u.userName',
          'u.proFileImageUrl',
        ])
        .from(Comments, 'c')
        .innerJoin(Users, 'u', 'c.usersID = u.id')
        .where('c.postsId = :postID', { postID: postID })
        .andWhere('c.replyLevel = :replyLevel', { replyLevel: 0 })
        .maxExecutionTime(10000);
      const queryResult = await query.getRawMany();
      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
      // 데이터 반환
      return queryResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ViewPostCommentsFaild(`service.comment.viewpostcomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    } finally {
      // 생성된 커넥션을 해제합니다.
      await queryRunner.release();
    }
  }
  // 특정 코멘트의  답글 모두 반환
  async viewCommentsComments(rootCommentID: string) {
    try {
      return await this.commentsRepo.find({
        replyTo: rootCommentID,
      });
    } catch (error) {
      throw new ViewPostCommentsFaild(`service.comment.viewpostcomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  // 코멘트를 수정합니다.
  async updateComment(commentID: string, contents: string) {
    try {
      return await this.commentsRepo.save({
        id: commentID,
        htmlContent: contents,
        updateAt: Time.nowDate(),
      });
    } catch (error) {
      throw new UpdateCommentsFaild(`service.comment.updatecomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  // 코멘트를 삭제합니다.
  async deleteComment(commentID: string) {
    try {
      return await this.commentsRepo.softRemove({
        id: commentID,
      });
    } catch (error) {
      throw new DeleteCommentsFaild(`service.comment.deletecomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
}
