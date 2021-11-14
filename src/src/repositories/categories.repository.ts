import { CreateCategoryDto } from 'src/categories/dto/Categories.Create.DTO';
import { Category } from 'src/entities/Category';
import { EntityManager, EntityRepository, getConnection, Repository } from 'typeorm';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  public async createCategory(createCategory: CreateCategoryDto) {
    await getConnection().transaction(async (entityManager: EntityManager) => {
      const isCategory = await entityManager.findOne(Category, { where: { categoryName: createCategory.categoryName } });

      if (isCategory) {
        throw new Error('이미 존재하는 카테고리입니다.');
      }

      return await entityManager.save(Category, createCategory);
    });
  }
}
