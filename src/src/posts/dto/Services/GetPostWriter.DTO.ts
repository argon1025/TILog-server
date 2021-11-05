import { PickType } from '@nestjs/swagger';
import { Posts } from '../../../entities/Posts';

export class GetPostWriterDto extends PickType(Posts, ['id']) {}

export class GetPostWriterResponseDto extends PickType(Posts, ['usersId', 'private', 'deletedAt']) {}
