import { PickType } from '@nestjs/mapped-types';
import { PostLike } from 'src/entities/PostLike';
import { Posts } from '../../../entities/Posts';

export class SetPostToLikeDto extends PickType(PostLike, ['usersId', 'postsId']) {}
export class SetPostToLikeResponseDto extends PickType(Posts, ['likes']) {}
