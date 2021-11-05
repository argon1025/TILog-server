import { PickType } from '@nestjs/swagger';
import { Posts } from '../../../entities/Posts';

export class CreatePostDto extends PickType(Posts, ['usersId', 'categoryId', 'title', 'thumbNailUrl', 'markDownContent', 'private']) {}
