import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

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
}
