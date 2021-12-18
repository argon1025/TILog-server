import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';

export class CreateCommentDto extends PickType(Comments, ['usersId', 'postsId', 'htmlContent', 'createdAt']) {}
