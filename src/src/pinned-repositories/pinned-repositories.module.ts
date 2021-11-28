import { Module } from '@nestjs/common';
import { PinnedRepositoriesService } from './pinned-repositories.service';
import { PinnedRepositoriesController } from './pinned-repositories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinnedRepositories } from 'src/entities/PinnedRepositories';
import { Category } from 'src/entities/Category';
import { PinnedRepositoryCategories } from 'src/entities/PinnedRepositoryCategories';

@Module({
  imports: [TypeOrmModule.forFeature([PinnedRepositories, Category, PinnedRepositoryCategories])],
  providers: [PinnedRepositoriesService],
  controllers: [PinnedRepositoriesController],
})
export class PinnedRepositoriesModule {}
