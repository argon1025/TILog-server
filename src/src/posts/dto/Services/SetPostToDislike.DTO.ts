import { PickType } from '@nestjs/swagger';
import { PostLike } from 'src/entities/PostLike';
import { Posts } from '../../../entities/Posts';

export class SetPostToDislikeDto extends PickType(PostLike, ['usersId', 'postsId']) {}
export class SetPostToDislikeResponseDto extends PickType(Posts, ['likes']) {}
