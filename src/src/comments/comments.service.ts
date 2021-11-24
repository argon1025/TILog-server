import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Repository } from 'typeorm/repository/Repository';
import Time from '../utilities/time.utility';
import {
  CommentWriteFailed,
  DeleteCommentFaild,
  CommentToCommentWriteFailed,
  UpdateCommentFaild,
  ViewAllCommentsFaild,
  DisableLevel,
  ViewOneCommentFaild,
  NotCommentOwner,
  UnDeleteCommentFaild,
  GetCommentsUsersFailed,
} from 'src/ExceptionFilters/Errors/Comments/Comment.error';
import { WriteNewCommentOnPostDto } from './dto/service/writeNewCommentOnPost.dto';
import { WriteNewCommentToCommentDto } from './dto/service/writeNewCommentToComment.dto';
import { UpdateCommentDto } from './dto/service/updateComment.dto';
import { DeleteCommentDto } from './dto/service/deleteComment.dto';
import { UnDeleteCommentDto } from './dto/service/unDeleteComment.dto';
import { Connection, In } from 'typeorm';
import { Users } from 'src/entities/Users';
@Injectable()
export class CommentsService {
  constructor(
    private connection: Connection,
    @InjectRepository(Comments) private commentsRepo: Repository<Comments>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  /**
   * write New comment on post
   * 포스트에 새로운 코멘트를 작성합니다.
   * @returns Comments
   */
  async writeNewCommentOnPost(writeNewCommentOnPostDto: WriteNewCommentOnPostDto): Promise<Comments> {
    try {
      const { usersId, postsId, htmlContent } = writeNewCommentOnPostDto;
      return await this.commentsRepo.save({
        usersId: usersId,
        postsId: postsId,
        htmlContent: htmlContent,
        createdAt: Time.nowDate(),
      });
    } catch (error) {
      // 에러 생성
      throw new CommentWriteFailed(`service.comments.writenewcommentonpost.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   *  write new comment to comment
   *  답글 작성를 작성합니다.
   * @param reqData
   * @returns Promise<Comments>
   */
  async writeNewCommentToComment(writeNewCommentToCommentDto: WriteNewCommentToCommentDto): Promise<Comments> {
    try {
      const { usersId, postsId, htmlContent, replyLevel, replyTo } = writeNewCommentToCommentDto;
      // 답글의 레벨 검증
      await this.vaildateCommentLevel(replyTo);
      // 답글 저장
      return await this.commentsRepo.save({
        usersId: usersId,
        postsId: postsId,
        htmlContent: htmlContent,
        replyTo: replyTo,
        replyLevel: replyLevel,
        createdAt: Time.nowDate(),
      });
    } catch (error) {
      if (error instanceof DisableLevel) throw error;
      throw new CommentToCommentWriteFailed(`service.comment.writnewcommenttocomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * view all comments
   * 특정 포스트의 모든 코멘트를 반환합니다.
   * @param postID
   * @returns Array<Comments>
   */
  async viewAllComments(postID: string): Promise<any> {
    try {
      const comment = await this.commentsRepo.find({ where: { postsId: postID, replyLevel: 0 }, relations: ['childComment'] });

      return comment;
    } catch (error) {
      throw new ViewAllCommentsFaild(`service.comment.viewpostcomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  async getCommentsWriteUsers(postID: string): Promise<any> {
    try {
      const user = await this.usersRepo
        .createQueryBuilder()
        .where(`users.id IN (select distinct usersId from comments where comments.postsId = ${postID})`)
        .getMany();
      return user;
    } catch (error) {
      throw new GetCommentsUsersFailed(`service.comment.getCommentsWriteUsers.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  /**
   * view one comments
   * 특정 코멘트를 1개 반환합니다.
   * @param commentID
   * @returns Promise<Comments>
   */
  async viewOneComments(commentID: string): Promise<Comments> {
    try {
      return await this.commentsRepo.createQueryBuilder('comments').withDeleted().where('comments.id = :commentID', { commentID }).getOne();
    } catch (error) {
      throw new ViewOneCommentFaild(`service.comment.viewonecomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * update comment
   * 코멘트를 업데이트합니다.
   * @param reqData
   * @returns
   */
  async updateComment(updateCommentDto: UpdateCommentDto) {
    const { usersId, id, htmlContent } = updateCommentDto;
    try {
      // 요청한 유저의 코멘트인지 확인
      await this.isCommentOwner(usersId, id);
      // 자신의 코멘트가 맞다면 코멘트 업데이트
      return await this.commentsRepo.save({
        id: id,
        htmlContent: htmlContent,
        updateAt: Time.nowDate(),
      });
    } catch (error) {
      // not owner
      if (error instanceof NotCommentOwner) throw error;
      // not found comment
      if (error instanceof ViewOneCommentFaild) throw error;
      // update error
      throw new UpdateCommentFaild(`service.comment.updatecomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * soft delete comment
   * 코멘트를 소프트 딜리트합니다.
   * @param reqData
   * @returns
   */
  async deleteComment(deleteCommentDto: DeleteCommentDto) {
    const { usersId, id } = deleteCommentDto;
    try {
      // 요청한 유저의 코멘트인지 확인
      await this.isCommentOwner(usersId, id);
      // 코멘트 삭제
      return await this.commentsRepo.softRemove({
        id: id,
      });
    } catch (error) {
      // not owner
      if (error instanceof NotCommentOwner) throw error;
      // not found comment
      if (error instanceof ViewOneCommentFaild) throw error;
      // delete error
      throw new DeleteCommentFaild(`service.comment.deletecomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  async unDeleteComment(unDeleteCommentDto: UnDeleteCommentDto) {
    const { usersId, id } = unDeleteCommentDto;
    try {
      // 요청한 유저의 코멘트인지 확인
      await this.isCommentOwner(usersId, id);
      return await this.commentsRepo.restore({ id: id });
    } catch (error) {
      // not owner
      if (error instanceof NotCommentOwner) throw error;
      // not found comment
      if (error instanceof ViewOneCommentFaild) throw error;
      // delete error
      throw new UnDeleteCommentFaild(`service.comment.undeletecomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  /**
   * vaildate comment level
   * 코멘트의 레벨을 검증합니다.
   * @param commentID
   */
  async vaildateCommentLevel(commentID: string): Promise<void> {
    const { replyLevel } = await this.commentsRepo.findOne({
      id: commentID,
    });
    if (replyLevel) throw new DisableLevel(`service.comment.vaildateCommentLevel.this comment is child`);
  }
  /**
   * check comment owner
   * 코멘트의 오너를 확인합니다.
   * @param requestUserID
   * @param commentID
   * @returns Promise<Boolean>
   */
  async isCommentOwner(requestUserID: number, commentID: string): Promise<void> {
    const { usersId } = await this.viewOneComments(commentID);
    if (usersId != requestUserID) {
      throw new NotCommentOwner(`service.comment.iscommentowner.you are not owner`);
    }
  }
}
