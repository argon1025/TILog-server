import { Test, TestingModule } from '@nestjs/testing';
import { PinnedRepositoriesService } from './pinned-repositories.service';

describe('PinnedRepositoriesService', () => {
  let service: PinnedRepositoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinnedRepositoriesService],
    }).compile();

    service = module.get<PinnedRepositoriesService>(PinnedRepositoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
