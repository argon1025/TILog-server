import { PickType } from '@nestjs/mapped-types';
import { Posts } from '../../../entities/Posts';

export class GetPostAuthorDto extends PickType(Posts, ['id']) {}

export class GetPostAuthorResponseDto extends PickType(Posts, ['usersId']) {}
