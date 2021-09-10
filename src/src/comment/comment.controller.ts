import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { UserStats } from 'src/auth/decorators/userStats.decorator';
import { AuthenticatedGuard } from 'src/auth/guard/github.auth.guard';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  /**
   * 새로운 댓글을 생성합니다.
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Post(':postid')
  @UseGuards(AuthenticatedGuard)
  createNewComment(@UserStats('id') userID: number, @Param('postid') postID: string, @Body('contents') contents: string) {
    return this.commentService.createComment(userID, postID, contents);
  }
}
