import { ApiProperty, PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class CommentContentDto extends PickType(Comments, ['htmlContent']) {}
