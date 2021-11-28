import { Module } from '@nestjs/common';
import { PinnedRepositoriesService } from './pinned-repositories.service';
import { PinnedRepositoriesController } from './pinned-repositories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinnedRepositories } from 'src/entities/PinnedRepositories';

@Module({
  imports: [TypeOrmModule.forFeature([PinnedRepositories])],
  providers: [PinnedRepositoriesService],
  controllers: [PinnedRepositoriesController],
})
export class PinnedRepositoriesModule {}
