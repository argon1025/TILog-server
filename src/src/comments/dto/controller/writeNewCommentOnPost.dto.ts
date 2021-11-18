import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class WriteNewCommentOnPostDto extends PickType(Comments, ['usersId', 'postsId', 'htmlContent']) {}
