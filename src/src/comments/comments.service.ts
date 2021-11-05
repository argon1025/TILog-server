import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Repository } from 'typeorm/repository/Repository';
@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comments) private commentsRepo: Repository<Comments>) {}

  //////////////////// WriteComments

  // 코멘트 작성
  async writePostComment(userID: number, postID: string, contents: string): Promise<Comments> {
    try {
      return await this.commentsRepo.save({
        usersId: userID,
        postsId: postID,
        htmlContent: contents,
        replyLevel: 0,
        createdAt: 0,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
