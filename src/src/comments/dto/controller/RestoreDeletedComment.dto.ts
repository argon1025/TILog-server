import { PartialType } from '@nestjs/swagger';
import { DeleteCommentDto } from './deleteComment.dto';

export class RestoreDeletedCommentDto extends PartialType(DeleteCommentDto) {}
