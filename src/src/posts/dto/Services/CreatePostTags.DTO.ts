import { PickType } from '@nestjs/swagger';
import { Tags } from 'src/entities/Tags';

export class CreatePostTags extends PickType(Tags, ['id', 'tagsName']) {}
