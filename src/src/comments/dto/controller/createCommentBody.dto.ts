import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class CreateCommentBodyDto extends PickType(Comments, ['postsId', 'htmlContent']) {}
