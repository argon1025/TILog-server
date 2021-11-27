import { Body, Controller, Get, HttpException, Post, Query, Version } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import ResponseUtility from 'src/utilities/Response.utility';
import { CreateTagDto } from './dto/Tags.Create.DTO';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Version('1')
  @Post()
  @ApiTags('Tags')
  @ApiOperation({ summary: '태그를 생성합니다.' })
  @ApiBody({
    type: CreateTagDto,
  })
  async createTag(@Body() createTag: CreateTagDto) {
    try {
      await this.tagsService.createTag(createTag);

      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`tags.controller.${this.createTag.name}.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  @Version('1')
  @Get('search')
  @ApiTags('Tags')
  @ApiOperation({ summary: '태그를 검색합니다.' })
  async searchTags(@Query() { tagName }) {
    try {
      return await this.tagsService.getTags(tagName);
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(`tags.controller.${this.createTag.name}.${!!error.message ? error.message : 'Unknown_Error'}`);
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
