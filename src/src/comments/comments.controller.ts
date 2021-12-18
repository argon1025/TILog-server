import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Version } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
// Custom Decorator
import { UserInfo } from 'src/auth/decorators/userInfo.decorator';
// Guard
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
// Service
import { CommentsService } from './comments.service';
// DTO
import { RestoreDeletedCommentDto } from './dto/RestoreDeletedComment.dto';
import { CommentContentDto } from './dto/controller/commentContent.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { DeleteCommentDto } from './dto/deleteComment.dto';
import { CreateReplyDto } from './dto/createReply.dto';
// utilities
import ResponseUtility from 'src/utilities/Response.utility';
import Time from '../utilities/time.utility';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * create comment to post
   * 포스트에 코멘트를 생성합니다.
   * @guards 유저 인증
   * @author minjecho <minje9801@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Post('post/:postid')
  @ApiOperation({ summary: '포스트에 코멘트를 생성합니다.' })
  @ApiBody({
    type: CommentContentDto,
  })
  @UseGuards(AuthenticatedGuard)
  async createComment(@UserInfo('id') userId: number, @Param('postid') postId: string, @Body('htmlContent') htmlContent: string) {
    // comment data 설정
    const commentData = new CreateCommentDto();
    commentData.usersId = userId;
    commentData.postsId = postId;
    commentData.htmlContent = htmlContent;
    commentData.createdAt = Time.nowDate();
    try {
      // 새로운 코멘트 생성을 요청합니다.
      await this.commentsService.createComment(commentData);
      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   *  create reply
   *  답글 작성를 작성합니다.
   * @guards 유저 인증
   * @author minjecho <minje9801@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Post(':commentid/post/:postid')
  @ApiOperation({ summary: '답글을 생성합니다.' })
  @ApiBody({
    type: CreateReplyDto,
  })
  @UseGuards(AuthenticatedGuard)
  async createReply(
    @UserInfo('id') userId: number,
    @Param('postid') postId: string,
    @Param('commentid') commentId: string,
    @Body('htmlContent') htmlContent: string,
  ) {
    const replyData = new CreateReplyDto();
    replyData.usersId = userId;
    replyData.postsId = postId;
    replyData.replyTo = commentId;
    replyData.htmlContent = htmlContent;
    replyData.replyLevel = 1;
    replyData.createdAt = Time.nowDate();
    try {
      // 새로운 답글을 요청합니다.
      await this.commentsService.createReply(replyData);
      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  /**
   * Returns the comment on the post.
   * 포스트의 코멘트를 반환합니다.
   * @author minjecho <minje9801@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Get('post/:postid')
  @ApiOperation({ summary: '포스트의 모든 코멘트를 가져옵니다.' })
  async getComments(@Param('postid') postId: string) {
    try {
      // 코멘트를 요청합니다.
      const commentRes = await this.commentsService.getComments(postId);
      return commentRes;
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  /**
   * Returns the reply on the post.
   * 코멘트의 모든 답글을 반환합니다.
   * @author minjecho <minje9801@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Get(':commentsid')
  @ApiOperation({ summary: '코멘트의 모든 답글을 가져옵니다.' })
  async getReplies(@Param('commentsid') commentId: string) {
    try {
      // 답글을 요청합니다.
      const childCommentRes = await this.commentsService.getReplies(commentId);
      return childCommentRes;
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  /**
   * update comment
   * 코멘트를 업데이트합니다.
   * @guards 유저 인증
   * @author minjecho <minje9801@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Patch(':commentid')
  @ApiOperation({ summary: '코멘트를 업데이트합니다.' })
  @ApiBody({
    type: CommentContentDto,
  })
  @UseGuards(AuthenticatedGuard)
  async updateComment(@UserInfo('id') userId: number, @Param('commentid') commentId: string, @Body('htmlContent') htmlContent: string) {
    const commentData = new UpdateCommentDto();
    commentData.id = commentId;
    commentData.usersId = userId;
    commentData.htmlContent = htmlContent;
    commentData.updatedAt = Time.nowDate();
    try {
      // 코멘트의 정보수정을 요청합니다.
      await this.commentsService.updateComment(commentData);
      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.codeNumber);
    }
  }

  /**
   * soft delete comment
   * 코멘트를 소프트 딜리트합니다.
   * @guards 유저 인증
   * @author minjecho <minje9801@gmail.com>
   * @version 1.0.0
   */
  @Version('1')
  @Delete(':commentid')
  @ApiOperation({ summary: '코멘트를 삭제합니다.' })
  @UseGuards(AuthenticatedGuard)
  async deleteComment(@UserInfo('id') userId: number, @Param('commentid') commentId: string) {
    const commentData = new DeleteCommentDto();
    commentData.id = commentId;
    commentData.usersId = userId;
    commentData.deletedAt = Time.nowDate();
    try {
      // 코멘트를 삭제 요청합니다.
      await this.commentsService.deleteComment(commentData);
      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   * 삭제한 댓글을 복구합니다.
   */
  @Version('1')
  @Patch('/restore/:commentid')
  @ApiOperation({ summary: '삭제한 댓글을 복구합니다.' })
  async unDeleteComment(@UserInfo('id') userId: number, @Param('commentid') commentID: string) {
    const commentData = new RestoreDeletedCommentDto();
    commentData.id = commentID;
    commentData.usersId = userId;
    try {
      // 삭제한 댓글을 복구 요청합니다.
      await this.commentsService.restoreDeletedComment(commentData);
      // 응답 리턴
      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
}
