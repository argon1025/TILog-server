import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Version } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/decorators/userInfo.decorator';
import { AuthenticatedGuard } from 'src/auth/guard/auth.guard';
import { CommentsService } from './comments.service';
// dto
import { WriteNewCommentToCommentDto } from './dto/controller/writeNewCommentToComment.dto';
import { WriteNewCommentOnPostDto } from './dto/controller/writeNewCommentOnPost.dto';
import { writeAndUpdateDto } from './dto/writeAndUpdate.dto';
import { UnDeleteCommentDto } from './dto/controller/unDeleteComment.dto';
import { UpdateCommentDto } from './dto/controller/updateComment.dto';
import { DeleteCommentDto } from './dto/controller/deleteComment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 새로운 댓글을 생성
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Version('1')
  @Post('post/:postid')
  @ApiOperation({ summary: '포스터에 새로운 댓글을 생성합니다.' })
  @ApiBody({
    type: writeAndUpdateDto,
  })
  @UseGuards(AuthenticatedGuard)
  async writeNewCommentOnPost(@UserInfo('id') userID: number, @Param('postid') postID: string, @Body('htmlContent') htmlContent: string) {
    const writeNewCommentOnPostDto = new WriteNewCommentOnPostDto();
    writeNewCommentOnPostDto.usersId = userID;
    writeNewCommentOnPostDto.postsId = postID;
    writeNewCommentOnPostDto.htmlContent = htmlContent;
    try {
      return await this.commentsService.writeNewCommentOnPost(writeNewCommentOnPostDto);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   * 대댓글을 생성
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Version('1')
  @Post(':commentid/post/:postid')
  @ApiOperation({ summary: '댓글에 답글을 작성합니다.' })
  @ApiBody({
    type: WriteNewCommentToCommentDto,
  })
  @UseGuards(AuthenticatedGuard)
  async writeNewCommentToComment(
    @UserInfo('id') userID: number,
    @Param('postid') postID: string,
    @Param('commentid') commentid: string,
    @Body('htmlContent') htmlContent: string,
  ) {
    const writeNewCommentToCommentDto = new WriteNewCommentToCommentDto();
    writeNewCommentToCommentDto.usersId = userID;
    writeNewCommentToCommentDto.postsId = postID;
    writeNewCommentToCommentDto.replyTo = commentid;
    writeNewCommentToCommentDto.htmlContent = htmlContent;
    writeNewCommentToCommentDto.replyLevel = 1;

    try {
      return await this.commentsService.writeNewCommentToComment(writeNewCommentToCommentDto);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }

  /**
   * 모든 코멘트 보기
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Version('1')
  @Get('post/:postid')
  @ApiOperation({ summary: '포스트의 모든 코멘트를 가져옵니다.' })
  async viewAllComments(@Param('postid') postID: string) {
    try {
      const result = await this.commentsService.viewAllComments(postID);
      return result;
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   * 코멘트의 작성자 리스트
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Version('1')
  @Get('writeusers/post/:postid')
  @ApiOperation({ summary: '포스트의 모든 코멘트를 가져옵니다.' })
  async getCommentsWriteUsers(@Param('postid') postID: string) {
    try {
      const result = await this.commentsService.getCommentsWriteUsers(postID);
      return result;
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   * 특정 코멘트 보기
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Version('1')
  @Get(':commentid')
  @ApiOperation({ summary: '특정 코멘트를 가져옵니다.' })
  async viewOneComments(@Param('commentid') commentID: string) {
    try {
      return await this.commentsService.viewOneComments(commentID);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   * 코멘트 수정
   * *인증된 유저만 코멘트를 작성할 수 있습니다.
   */
  @Version('1')
  @Patch(':commentid')
  @ApiOperation({ summary: '포스트의 모든 코멘트를 수정합니다.' })
  @ApiBody({
    type: writeAndUpdateDto,
  })
  // @UseGuards(AuthenticatedGuard)
  async updateComment(@UserInfo('id') userID: number, @Param('commentid') commentID: string, @Body('htmlContent') htmlContent: string) {
    const updateCommentDto = new UpdateCommentDto();
    updateCommentDto.id = commentID;
    updateCommentDto.usersId = userID;
    updateCommentDto.htmlContent = htmlContent;
    try {
      return await this.commentsService.updateComment(updateCommentDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, error.codeNumber);
    }
  }
  /**
   * 삭제한 댓글을 복구합니다.
   */
  // @Version('1')
  // @Patch(':commentid')
  // @ApiOperation({ summary: '삭제한 댓글을 복구합니다.' })
  // async unDeleteComment(@UserInfo('id') userID: number, @Param('commentid') commentID: string) {
  //   const unDeleteCommentDto = new UnDeleteCommentDto();
  //   unDeleteCommentDto.id = commentID;
  //   unDeleteCommentDto.usersId = userID;
  //   try {
  //     return await this.commentsService.unDeleteComment(unDeleteCommentDto);
  //   } catch (error) {
  //     throw new HttpException(error, error.codeNumber);
  //   }
  // }
  /**
   * 댓글을 삭제합니다.
   */
  @Version('1')
  @Delete(':commentid')
  @ApiOperation({ summary: '포스트의 모든 코멘트를 삭제합니다.' })
  // @UseGuards(AuthenticatedGuard)
  async deleteComment(@UserInfo('id') userID: number, @Param('commentid') commentID: string) {
    const deleteCommentDto = new DeleteCommentDto();
    deleteCommentDto.id = commentID;
    deleteCommentDto.usersId = userID;
    try {
      return await this.commentsService.deleteComment(deleteCommentDto);
    } catch (error) {
      throw new HttpException(error, error.codeNumber);
    }
  }
}
