import { Body, Controller, Get, HttpException, Param, Post, Version } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import ResponseUtility from 'src/utilities/Response.utility';
import { CreatePinnedRepositoriesDto, CreatePinnedRepositoryCategories } from './dto/CreatePinnedRepositories.DTO';
import { PinnedRepositoriesService } from './pinned-repositories.service';

@Controller('pinned-repositories')
export class PinnedRepositoriesController {
  constructor(private readonly pinnedRepositoriesService: PinnedRepositoriesService) {}

  @Version('1')
  @Post()
  @ApiTags('pinned한 레포지토리를 등록합니다.')
  @ApiOperation({ summary: '를 생성합니다.' })
  @ApiBody({
    type: CreatePinnedRepositoriesDto,
  })
  async createPinnedRepository(@Body() createPinnedRepositories: CreatePinnedRepositoriesDto) {
    try {
      await this.pinnedRepositoriesService.createPinnedRepositories(createPinnedRepositories);

      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(
          `${PinnedRepositoriesController.name}.${this.createPinnedRepository.name}.${!!error.message ? error.message : 'Unknown_Error'}`,
        );
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  @Version('1')
  @Post(':pinnedRepositoriesId/categories')
  @ApiTags('pinned한 레포지토리를 카테고리 등록합니다.')
  @ApiOperation({ summary: '를 생성합니다.' })
  @ApiBody({
    type: CreatePinnedRepositoryCategories,
  })
  async createPinnedRepositoryCategories(
    @Param() { pinnedRepositoriesId }: { pinnedRepositoriesId: number },
    @Body() createPinnedRepositoryCategories: CreatePinnedRepositoryCategories[],
  ) {
    try {
      await this.pinnedRepositoriesService.createPinnedRepositoryCategories(pinnedRepositoriesId, createPinnedRepositoryCategories);

      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(
          `${PinnedRepositoriesController.name}.${this.createPinnedRepositoryCategories.name}.${!!error.message ? error.message : 'Unknown_Error'}`,
        );
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }

  @Version('1')
  @Get(':pinnedRepositoriesId')
  @ApiTags('pinned한 레포지토리 가져 옵니다.')
  @ApiOperation({ summary: '를 생성합니다.' })
  async getPinnedRepository(@Param() { pinnedRepositoriesId }: { pinnedRepositoriesId: number }) {
    try {
      const pinnedRepository = await this.pinnedRepositoriesService.getPinnedRepository(pinnedRepositoriesId);

      return ResponseUtility.create(false, 'ok', pinnedRepository);
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(
          `${PinnedRepositoriesController.name}.${this.getPinnedRepository.name}.${!!error.message ? error.message : 'Unknown_Error'}`,
        );
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
