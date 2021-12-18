import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class WriteNewCommentToCommentDto extends PickType(Comments, ['htmlContent', 'replyTo']) {}
