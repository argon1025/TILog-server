import { PickType } from '@nestjs/mapped-types';
import { Posts } from '../../../entities/Posts';

export class GetPostWriterDto extends PickType(Posts, ['id']) {}

export class GetPostWriterResponseDto extends PickType(Posts, ['usersId']) {}
