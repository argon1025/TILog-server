import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/Category';
import { CategoryCreateFail, CategorySearchFail } from 'src/ExceptionFilters/Errors/Categories/Category.error';
import { CategoryRepository } from 'src/repositories/categories.repository';
import { chosungHangul, isChosung } from 'src/utilities/hungul';
import { Like } from 'typeorm';
import { CreateCategoryDto } from './dto/Categories.Create.DTO';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoryRepository) {}

  /**
   * 카테고리 생성
   * @param createCategory
   * @returns Promise<boolean>
   */
  async createCategory(createCategory: CreateCategoryDto): Promise<boolean> {
    try {
      await this.categoriesRepository.createCategory(createCategory);
      return true;
    } catch (error) {
      throw new CategoryCreateFail(`${CategoriesService.name}.${this.createCategory.name}: ${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  public async getCategories(categoryName: string) {
    try {
      /* 한글 자음 추출 */
      const chosungStr = chosungHangul(categoryName);
      let categories: Category[];

      /* 한글 초성일 경우 */
      if (isChosung(categoryName, chosungStr)) {
        categories = await this.categoriesRepository
          .createQueryBuilder()
          .where(`fn_choSearch(categoryName) LIKE concat('%', '${categoryName.trim()}', '%')`)
          .getMany();
      } else {
        /* 초성이 아닐 경우 */
        categories = await this.categoriesRepository.find({
          categoryName: Like(`%${categoryName}%`),
        });
      }
      return categories;
    } catch (error) {
      throw new CategorySearchFail(`${CategoriesService.name}.${this.getCategories.name}: ${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
}
