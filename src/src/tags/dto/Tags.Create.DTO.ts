import { PickType } from '@nestjs/mapped-types';
import { Tags } from 'src/entities/Tags';

export class CreateTagDto extends PickType(Tags, ['tagsName']) {}
