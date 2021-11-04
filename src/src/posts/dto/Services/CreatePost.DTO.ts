import { PickType } from '@nestjs/mapped-types';
import { Posts } from '../../../entities/Posts';

export class CreatePostDto extends PickType(Posts, ['usersId', 'categoryId', 'title', 'thumbNailUrl', 'markDownContent', 'private']) {}
