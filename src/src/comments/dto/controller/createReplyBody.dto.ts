import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class CreateReplyBodyDto extends PickType(Comments, ['id', 'postsId', 'htmlContent', 'replyTo']) {}
