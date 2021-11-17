import { Injectable } from '@nestjs/common';
import { CategoryCreateFail } from 'src/ExceptionFilters/Errors/Categories/Category.error';
import { CategoryRepository } from 'src/repositories/categories.repository';
import { CreateCategoryDto } from './dto/Categories.Create.DTO';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoryRepository) {}

  /**
   * 카테고리 생성
   * @param createCategory
   * @returns Promise<boolean>
   */
  async createCategory(createCategory: CreateCategoryDto):Promise<boolean> {
    try {
      await this.categoriesRepository.createCategory(createCategory);
      return true;
    } catch (error) {
      throw new CategoryCreateFail(`${CategoriesService.name}.${this.createCategory.name}: ${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
}
