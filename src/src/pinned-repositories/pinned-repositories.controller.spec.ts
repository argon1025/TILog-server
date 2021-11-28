import { Test, TestingModule } from '@nestjs/testing';
import { PinnedRepositoriesController } from './pinned-repositories.controller';

describe('PinnedRepositoriesController', () => {
  let controller: PinnedRepositoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinnedRepositoriesController],
    }).compile();

    controller = module.get<PinnedRepositoriesController>(PinnedRepositoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
