import { PickType } from '@nestjs/mapped-types';
import { Posts } from '../../../entities/Posts';

export class UpdatePostDto extends PickType(Posts, ['id', 'categoryId', 'title', 'thumbNailUrl', 'markDownContent', 'private']) {}
