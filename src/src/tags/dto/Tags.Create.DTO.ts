import { PickType } from '@nestjs/swagger';
import { Tags } from 'src/entities/Tags';

export class CreateTagDto extends PickType(Tags, ['tagsName']) {}
