import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { CreateReplyComment } from './dto/createReplyComment.dto';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comments) private commentsRepo: Repository<Comments>) {}
  /**
   * @param userID 유저 아이디
   * @param postID 포스트 아이디
   * @param contents 코멘트 내용
   * @returns
   */
  async createNewComment(userID: number, postID: string, contents: string) {
    const now = new Date();
    return await this.commentsRepo.save({
      usersId: userID,
      postsId: postID,
      htmlContent: contents,
      replyLevel: 0,
      createdAt: now,
    });
  }
  /**
   *
   * @param userID 유저 아이디
   * @param postID 포스트 아이디
   * @param replyTo 상위 코멘트 아이디
   * @param commentInfo 코멘트 내용 및 상위 댓글 여부
   * @returns
   * @TODO error handling
   */
  async createReplyComment(userID: number, postID: string, replyTo: string, commentInfo: CreateReplyComment) {
    const now = new Date();
    const { contents, replyLevel } = commentInfo;
    if (replyLevel == 1) return 'error replyLevel is 1';
    return await this.commentsRepo.save({
      usersId: userID,
      postsId: postID,
      htmlContent: contents,
      replyTo: replyTo,
      replyLevel: 1,
      createdAt: now,
    });
  }
}
