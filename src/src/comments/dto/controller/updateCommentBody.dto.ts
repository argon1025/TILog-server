import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class UpdateCommentBodyDto extends PickType(Comments, ['htmlContent']) {}
