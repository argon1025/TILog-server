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
  DeleteCommentFaild,
  CommentToCommentWriteFailed,
  UpdateCommentFaild,
  ViewAllCommentsFaild,
  DisableLevel,
} from 'src/ExceptionFilters/Errors/Comments/Comment.error';
import { UpdateCommentDTO } from './dto/service/updateComment.dto';
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
        usersId: userID,
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
        usersId: userID,
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

  /**
   * view all comments
   * 특정 포스트의 모든 코멘트를 반환합니다.
   * @param postID
   * @returns Array<Comments>
   */
  async viewAllComments(postID: string): Promise<Array<Comments>> {
    try {
      return await this.commentsRepo.find({ where: { postsId: postID, replyLevel: 0 }, relations: ['childComment'] });
    } catch (error) {
      throw new ViewAllCommentsFaild(`service.comment.viewpostcomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  // 코멘트를 수정합니다.
  async updateComment(reqData: UpdateCommentDTO) {
    const { userID, commentID, contents } = reqData;
    try {
      // 자신의 코멘트인지 확인
      // 자신의 코멘트가 맞다면 코멘트 업데이트
      // 틀리다면 에러
      return await this.commentsRepo.save({
        id: commentID,
        htmlContent: contents,
        updateAt: Time.nowDate(),
      });
    } catch (error) {
      throw new UpdateCommentFaild(`service.comment.updatecomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  // 코멘트를 삭제합니다.
  async deleteComment(commentID: string) {
    try {
      return await this.commentsRepo.softRemove({
        id: commentID,
      });
    } catch (error) {
      throw new DeleteCommentFaild(`service.comment.deletecomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
}
