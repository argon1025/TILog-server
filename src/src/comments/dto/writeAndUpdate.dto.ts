import { ApiProperty, PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class writeAndUpdateDto extends PickType(Comments, ['htmlContent']) {}
