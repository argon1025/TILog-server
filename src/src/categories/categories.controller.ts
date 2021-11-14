import { Body, Controller, HttpException, Post, Version } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorHandlerNotFound } from 'src/ExceptionFilters/Errors/ErrorHandlerNotFound.error';
import ResponseUtility from 'src/utilities/Response.utility';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/Categories.Create.DTO';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Version('1')
  @Post()
  @ApiTags('Categories')
  @ApiOperation({ summary: '카테고리를 생성합니다.' })
  @ApiBody({
    type: CreateCategoryDto,
  })
  async createCategory(@Body() createCategory: CreateCategoryDto) {
    try {
      await this.categoriesService.createCategory(createCategory);

      return ResponseUtility.create(false, 'ok');
    } catch (error) {
      // 사전 정의된 에러인 경우
      if ('codeNumber' in error || 'codeText' in error || 'message' in error) {
        throw new HttpException(error, error.codeNumber);
      } else {
        // 사전 정의되지 않은 에러인 경우
        const errorResponse = new ErrorHandlerNotFound(
          `${CategoriesController.name}.${this.createCategory.name}.${!!error.message ? error.message : 'Unknown_Error'}`,
        );
        throw new HttpException(errorResponse, errorResponse.codeNumber);
      }
    }
  }
}
