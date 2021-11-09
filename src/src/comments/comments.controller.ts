import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { UserStats } from 'src/auth/decorators/userStats.decorator';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import { CommentsService } from './comments.service';
import { DeleteCommentDTO } from './dto/service/deleteComment.dto';
import { UpdateCommentDTO } from './dto/service/updateComment.dto';
import { WriteNewCommentOnPostDTO } from './dto/service/writeNewCommentOnPost.dto';
import { WriteNewCommentToCommentDTO } from './dto/service/writeNewCommentToComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 새로운 댓글을 생성합니다.
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Post('post/:postid')
  // @UseGuards(AuthenticatedGuard)
  async writeNewCommentOnPost(@UserStats('id') userID: number, @Param('postid') postID: string, @Body('contents') contents: string) {
    const reqData: WriteNewCommentOnPostDTO = {
      userID: userID,
      postID: postID,
      contents: contents,
    };
    try {
      return await this.commentsService.writeNewCommentOnPost(reqData);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   * 대댓글을 생성합니다.
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Post(':commentid/post/:postid')
  // @UseGuards(AuthenticatedGuard)
  async writeNewCommentToComment(
    @UserStats('id') userID: number,
    @Param('postid') postID: string,
    @Param('commentid') commentid: string,
    @Body('contents') contents: string,
  ) {
    const reqData: WriteNewCommentToCommentDTO = {
      userID: userID,
      postID: postID,
      contents: contents,
      replyLevel: 1,
      replyTo: commentid,
    };
    try {
      return await this.commentsService.writeNewCommentToComment(reqData);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  /**
   * 포스트ID에 해당하는 모든 댓글 반환
   */
  @Get('post/:postid')
  // @UseGuards(AuthenticatedGuard)
  async viewAllComments(@Param('postid') postID: string) {
    try {
      return await this.commentsService.viewAllComments(postID);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   *
   */
  @Patch(':commentid')
  // @UseGuards(AuthenticatedGuard)
  async updateComment(@UserStats('id') userID: number, @Param('commentid') commentID: string, @Body('contents') contents: string) {
    const reqData: UpdateCommentDTO = {
      userID: userID,
      commentID: commentID,
      contents: contents,
    };
    try {
      return await this.commentsService.updateComment(reqData);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.codeNumber);
    }
  }

  @Delete(':commentid')
  // @UseGuards(AuthenticatedGuard)
  async deleteComment(@UserStats('id') userID: number, @Param('commentid') commentID: string) {
    const reqData: DeleteCommentDTO = {
      userID: 2,
      commentID: commentID,
    };
    try {
      return await this.commentsService.deleteComment(reqData);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
}
