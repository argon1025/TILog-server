import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class CreateReplyDto extends PickType(Comments, ['usersId', 'postsId', 'htmlContent', 'replyLevel', 'replyTo', 'createdAt']) {}
