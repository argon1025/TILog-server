import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/Category';
import { PinnedRepositories } from 'src/entities/PinnedRepositories';
import { PinnedRepositoryCategories } from 'src/entities/PinnedRepositoryCategories';
import { CreatePinnedRepositoriesFail, GetPinnedRepository } from 'src/ExceptionFilters/Errors/PinnedRepositories/PinnedRepositories.error';
import { In, Repository } from 'typeorm';
import { CreatePinnedRepositoriesDto, CreatePinnedRepositoryCategories } from './dto/CreatePinnedRepositories.DTO';

@Injectable()
export class PinnedRepositoriesService {
  constructor(
    @InjectRepository(PinnedRepositories)
    private readonly pinnedRepositories: Repository<PinnedRepositories>,

    @InjectRepository(Category)
    private readonly categoryRepositories: Repository<Category>,

    @InjectRepository(PinnedRepositoryCategories)
    private readonly pinnedRepositoryCategories: Repository<PinnedRepositoryCategories>,
  ) {}

  public async createPinnedRepositories(createPinnedRepositories: CreatePinnedRepositoriesDto) {
    try {
      const registeredPinnedRepositories = await this.pinnedRepositories.findOne({ nodeId: createPinnedRepositories.nodeId });

      if (registeredPinnedRepositories) {
        throw Error('이미 등록된 pinned repository 입니다.');
      }

      await this.pinnedRepositories.save(this.pinnedRepositories.create(createPinnedRepositories));
      return true;
    } catch (error) {
      throw new CreatePinnedRepositoriesFail(
        `${PinnedRepositoriesService.name}.${this.createPinnedRepositories.name}: ${!!error.message ? error.message : 'Unknown_Error'}`,
      );
    }
  }

  public async createPinnedRepositoryCategories(pinnedRepositoriesId: number, createPinnedRepositoryCategories: CreatePinnedRepositoryCategories[]) {
    try {
      const pinnedRepository = await this.pinnedRepositories.findOne({ id: pinnedRepositoriesId });

      /* pinned repository가 존재하지 않을 때 */
      if (!pinnedRepository) {
        throw new Error('존재하지 않는 pinned repository 입니다.');
      }

      const categoryIds = createPinnedRepositoryCategories.map((category: Category) => category.id);
      const categories = await this.categoryRepositories.find({
        where: { id: In(categoryIds) },
      });

      /**
       * pinned repository에 카테고리 연결
       * 이미 연결되어 있던 카테고리는 연결하지 않음
       */
      await Promise.all(
        categories.map(async (category: Category) => {
          const pinnedRepositoryCategoreies = await this.pinnedRepositoryCategories.findOne({
            where: { pinnedRepositories: pinnedRepository, category: category },
          });

          if (!pinnedRepositoryCategoreies) {
            await this.pinnedRepositoryCategories.save({ pinnedRepositories: pinnedRepository, category: category });
          }
        }),
      );

      return true;
    } catch (error) {
      throw new CreatePinnedRepositoriesFail(
        `${PinnedRepositoriesService.name}.${this.createPinnedRepositoryCategories.name}: ${!!error.message ? error.message : 'Unknown_Error'}`,
      );
    }
  }

  public async getPinnedRepository(pinnedRepositoriesId: number): Promise<PinnedRepositories> {
    try {
      const pinnedRepository = await this.pinnedRepositories.findOne({ id: pinnedRepositoriesId });

      /* pinned repository가 존재하지 않을 때 */
      if (!pinnedRepository) {
        throw new Error('존재하지 않는 pinned repository 입니다.');
      }

      return pinnedRepository;
    } catch (error) {
      throw new GetPinnedRepository(
        `${PinnedRepositoriesService.name}.${this.getPinnedRepository.name}: ${!!error.message ? error.message : 'Unknown_Error'}`,
      );
    }
  }
}
