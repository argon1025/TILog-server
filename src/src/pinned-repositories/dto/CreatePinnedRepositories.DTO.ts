import { PickType } from '@nestjs/swagger';
import { Category } from 'src/entities/Category';
import { PinnedRepositories } from 'src/entities/PinnedRepositories';

export class CreatePinnedRepositoriesDto extends PickType(PinnedRepositories, ['nodeId', 'processPercent', 'demoUrl', 'position']) {}

export class CreatePinnedRepositoryCategories extends PickType(Category, ['id', 'categoryName']) {}
