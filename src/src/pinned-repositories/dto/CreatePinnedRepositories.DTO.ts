import { PickType } from '@nestjs/swagger';
import { PinnedRepositories } from 'src/entities/PinnedRepositories';

export class CreatePinnedRepositoriesDto extends PickType(PinnedRepositories, ['nodeId', 'processPercent', 'demoUrl', 'position']) {}
