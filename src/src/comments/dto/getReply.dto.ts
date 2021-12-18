import { PartialType } from '@nestjs/mapped-types';
import { GetCommentDto } from './getComment.dto';

export class GetReplyDto extends PartialType(GetCommentDto) {}
