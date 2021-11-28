import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinnedRepositories } from 'src/entities/PinnedRepositories';
import { CreatePinnedRepositoriesFail } from 'src/ExceptionFilters/Errors/PinnedRepositories/PinnedRepositories.error';
import { Repository } from 'typeorm';
import { CreatePinnedRepositoriesDto } from './dto/CreatePinnedRepositories.DTO';

@Injectable()
export class PinnedRepositoriesService {
  constructor(
    @InjectRepository(PinnedRepositories)
    private readonly pinnedRepositories: Repository<PinnedRepositories>,
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
}
