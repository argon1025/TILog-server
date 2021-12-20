import { PartialType } from '@nestjs/mapped-types';
import { GetCommentsDto } from './getComments.dto';

export class GetRepliesDto extends PartialType(GetCommentsDto) {}
