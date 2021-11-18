import { PartialType } from '@nestjs/swagger';
import { DeleteCommentDto } from './deleteComment.dto';

export class UnDeleteCommentDto extends PartialType(DeleteCommentDto) {}
