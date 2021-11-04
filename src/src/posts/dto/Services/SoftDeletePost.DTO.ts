import { PickType } from '@nestjs/mapped-types';
import { Posts } from '../../../entities/Posts';

export class SoftDeletePostDto extends PickType(Posts, ['id']) {}
