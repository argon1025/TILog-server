import { PickType } from '@nestjs/swagger';
import { Posts } from '../../../entities/Posts';

export class SoftDeletePostDto extends PickType(Posts, ['id']) {}
