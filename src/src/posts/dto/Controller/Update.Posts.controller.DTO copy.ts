import { PickType } from '@nestjs/swagger';
import { Posts } from '../../../entities/Posts';

export class UpdateDto extends PickType(Posts, ['categoryId', 'title', 'thumbNailUrl', 'markDownContent', 'private']) {}
