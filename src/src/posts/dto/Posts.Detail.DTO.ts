import { PickType } from '@nestjs/mapped-types';
import { Posts } from '../../entities/Posts';

export class PostDetailDto extends PickType(Posts, ['id', 'usersId', 'categoryId', 'title', 'thumbNailUrl', 'viewCounts', 'likes', 'markDownContent', 'private', 'createdAt', 'updatedAt']) {}
