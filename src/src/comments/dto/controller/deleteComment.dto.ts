import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class DeleteCommentDto extends PickType(Comments, ['usersId', 'id']) {}
