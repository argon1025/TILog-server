import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
// Error
import {
  AlreadyDeleted,
  AlreadyRestored,
  FaildCreateComment,
  FaildCreateReply,
  FaildDeleteComment,
  FaildGetComment,
  FaildGetComments,
  FaildGetReplies,
  FaildRestoreComment,
  FaildUpdateComment,
  MaxLevelReached,
  NotCommentAuthor,
  NotFoundComment,
} from 'src/ExceptionFilters/Errors/Comments/Comment.error';
// DTO
import { RestoreDeletedCommentDto } from './dto/RestoreDeletedComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { DeleteCommentDto } from './dto/deleteComment.dto';
import { GetCommentsDto } from './dto/getComments.dto';
import { CreateReplyDto } from './dto/createReply.dto';
// Entities
import { Comments } from 'src/entities/Comments';
import { Users } from 'src/entities/Users';
import { GetRepliesDto } from './dto/getReplies.dto';

@Injectable()
export class CommentsService {
  constructor(
    private connection: Connection,
    @InjectRepository(Comments) private commentsRepo: Repository<Comments>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  /**
   * create comment to post
   * 포스트에 코멘트를 생성합니다.
   * @param commentData
   * @returns Promise<boolean>
   * @todo class validator
   */
  async createComment(createCommentDto: CreateCommentDto): Promise<boolean> {
    try {
      // 코멘트 등록합니다.
      await this.commentsRepo.save(createCommentDto);
      return true;
    } catch (error) {
      // 에러 생성
      throw new FaildCreateComment(`service.comments.createcomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   *  create reply
   *  답글 작성를 작성합니다.
   * @param reqData
   * @returns Promise<boolean>
   * @todo class validator
   */
  async createReply(createReplyDto: CreateReplyDto): Promise<boolean> {
    try {
      // 답글을 작성하는 코멘트이 최상위 등급인지 확인합니다.
      await this.validateCommentLevel(createReplyDto.replyTo);
      // 답글 생성합니다.
      await this.commentsRepo.save(createReplyDto);
      return true;
    } catch (error) {
      // is not comment
      if (error instanceof MaxLevelReached) throw error;
      // 에러 생성
      throw new FaildCreateReply(`service.comment.createreply.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * Returns the comments on the post.
   * 포스트의 코멘트를 반환합니다.
   * @param postId
   * @returns Promise<GetCommentDto[]>
   * @todo class validator
   */
  async getComments(postId: string): Promise<GetCommentsDto[]> {
    try {
      // postid에 해당하는 부모 코멘트를 요청
      const comments = await this.commentsRepo
        .createQueryBuilder('comments')
        .select([
          'comments.id as comments_id',
          'comments.usersID as comments_usersID',
          'comments.postsID as comments_postsID',
          'comments.htmlContent as comments_htmlContent',
          'comments.replyTo as comments_replyTo',
          'comments.replyLevel as comments_replyLevel',
          'comments.createdAt as comments_createdAt',
          'comments.updatedAt as comments_updatedAt',
          'comments.deletedAt as comments_deletedAt',
        ])
        .addSelect(['users.id as users_id', 'users.userName as users_userName', 'users.proFileImageURL as users_proFileImageURL'])
        .addSelect(`(select count(*) from comments where replyTo = comments_id)`, 'childcount')
        .leftJoin(Users, 'users', 'users.id = comments.usersID')
        .where(`comments.postsId =  ${postId} and comments.replyLevel = 0`)
        .withDeleted()
        .getRawMany();
      return comments;
    } catch (error) {
      throw new FaildGetComments(`service.comment.getcomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * Returns the replies on the post.
   * 코멘트의 모든 답글을 반환합니다.
   * @param commentId
   * @returns Promise<GetReplyDto[]>
   * @todo class validator
   */
  async getReplies(commentId: string): Promise<GetRepliesDto[]> {
    try {
      console.log('comemtnasd', commentId);
      // 코멘트 레벨 검증
      await this.validateCommentLevel(commentId);
      console.log('comemtnasd', commentId);
      // postid에 해당하는 부모 코멘트를 요청
      const replies = await this.commentsRepo
        .createQueryBuilder('comments')
        .select([
          'comments.id as comments_id',
          'comments.usersID as comments_usersID',
          'comments.postsID as comments_postsID',
          'comments.htmlContent as comments_htmlContent',
          'comments.replyTo as comments_replyTo',
          'comments.replyLevel as comments_replyLevel',
          'comments.createdAt as comments_createdAt',
          'comments.updatedAt as comments_updatedAt',
          'comments.deletedAt as comments_deletedAt',
        ])
        .addSelect(['users.id as users_id', 'users.userName as users_userName', 'users.proFileImageURL as users_proFileImageURL'])
        .leftJoin(Users, 'users', 'users.id = comments.usersID')
        .where(`comments.replyTo =  ${commentId} and comments.replyLevel = 1`)
        .withDeleted()
        .getRawMany();
      return replies;
    } catch (error) {
      // is not comment
      if (error instanceof MaxLevelReached) throw error;
      throw new FaildGetReplies(`service.comment.getcomments.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * get comment
   * 특정 코멘트의 정보를 반환합니다.
   * @param commentId
   * @returns Promise<Comments>
   * @todo class validator
   */
  async getComment(commentId: string): Promise<Comments> {
    try {
      // 코멘트를 검색합니다.
      const comment = await this.commentsRepo.createQueryBuilder().withDeleted().where(`comments.id = ${commentId}`).getOne();
      // 코멘트를 찾을 수 없을 시
      if (!comment) throw new NotFoundComment(`service.comment.getcomment.No comments were found.`);
      // 코멘트가 있을 시
      return comment;
    } catch (error) {
      // 코멘트가 없을 시
      if (error instanceof NotFoundComment) throw error;
      // 에러
      throw new FaildGetComment(`service.comment.getcomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  /**
   * update comment
   * 코멘트를 업데이트합니다.
   * @param commentData
   * @returns
   * @todo class validator
   */
  async updateComment(updateCommentDto: UpdateCommentDto): Promise<boolean> {
    try {
      // 요청한 유저의 코멘트인지 확인
      await this.isCommentAuthor(updateCommentDto.usersId, updateCommentDto.id);
      // 자신의 코멘트가 맞다면 코멘트 업데이트
      await this.commentsRepo.save(updateCommentDto);
      return true;
    } catch (error) {
      // not owner
      if (error instanceof NotCommentAuthor) throw error;
      // not found comment
      if (error instanceof FaildGetComment) throw error;
      // update error
      throw new FaildUpdateComment(`service.comment.updatecomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * soft delete comment
   * 코멘트를 소프트 딜리트합니다.
   * @param commentData
   * @returns Promise<boolean>
   * @todo class validator
   * @todo 존재하는 코멘트인지 확인
   * @todo 요청한 유저의 코멘트인지 확인
   *
   */
  async deleteComment(deleteCommentDto: DeleteCommentDto): Promise<boolean> {
    try {
      // 요청한 유저의 코멘트인지 확인
      await this.isCommentAuthor(deleteCommentDto.usersId, deleteCommentDto.id);
      // 코멘트 삭제
      await this.commentsRepo.softRemove(deleteCommentDto);
      return true;
    } catch (error) {
      // not owner
      if (error instanceof NotCommentAuthor) throw error;
      // not found comment
      if (error instanceof FaildGetComment) throw error;
      // delete error
      throw new FaildDeleteComment(`service.comment.deletecomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  /**
   * restore deleted comment
   * 코멘트를 소프트 딜리트합니다.
   * @param reqData
   * @returns Promise<boolean>
   * @todo class validator
   *
   */
  async restoreDeletedComment(restoreDeletedCommentDto: RestoreDeletedCommentDto): Promise<boolean> {
    try {
      // 상태 확인
      await this.isRestored(restoreDeletedCommentDto.id);
      // 요청한 유저의 코멘트인지 확인
      await this.isCommentAuthor(restoreDeletedCommentDto.usersId, restoreDeletedCommentDto.id);
      // 댓글 복구
      await this.commentsRepo.restore(restoreDeletedCommentDto);
      return true;
    } catch (error) {
      // already restored
      if (error instanceof AlreadyRestored) throw error;
      // not owner
      if (error instanceof NotCommentAuthor) throw error;
      // not found comment
      if (error instanceof FaildGetComment) throw error;
      // delete error
      throw new FaildRestoreComment(`service.comment.restoredeletedcomment.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  /**
   * vaildate comment level
   * 코멘트의 레벨을 검증합니다.
   * @param commentId
   */
  async validateCommentLevel(commentId: string): Promise<void> {
    // 응답받은 comomentid의 replylevel 요청
    const { replyLevel } = await this.commentsRepo.createQueryBuilder('comments').where(`comments.id =  ${commentId}`).withDeleted().getOne();
    if (replyLevel) throw new MaxLevelReached(`service.comment.validateCommentLevel.this comment is child`);
  }

  /**
   * check comment owner
   * 코멘트의 작성자를 확인합니다.
   * @param userId
   * @param commentId
   * @returns Promise<Boolean>
   * @todo class validator
   *
   */
  async isCommentAuthor(userId: number, commentId: string): Promise<void> {
    // 응답받은 commentid이 usersid 요청
    const { usersId } = await this.getComment(commentId);
    // 응답받은 userId와 비교
    if (usersId != userId) {
      throw new NotCommentAuthor(`service.comment.iscommentowner.you are not owner`);
    }
  }

  /**
   * is comment restored
   * 코멘트가 복구된 상태인지 확인합니다.
   * @param commentId
   */
  async isRestored(commentId: string): Promise<void> {
    // 응답받은 commentid이 usersid 요청
    const { deletedAt } = await this.getComment(commentId);
    if (!deletedAt) throw new AlreadyRestored(`service.comment.iscommentowner.It's already been restored.`);
  }

  /**
   * is comment deleted
   * 코멘트가 삭제된 상태인지 확인합니다.
   * @param commentId
   */
  async isDeleted(commentId: string): Promise<void> {
    // 응답받은 commentid이 usersid 요청
    const { deletedAt } = await this.getComment(commentId);
    if (!deletedAt) throw new AlreadyDeleted(`service.comment.iscommentowner.It's already been deleted`);
  }
}
