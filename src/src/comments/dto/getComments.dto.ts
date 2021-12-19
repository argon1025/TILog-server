import { IntersectionType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/swagger';
import { Comments } from 'src/entities/Comments';
import { Users } from 'src/entities/Users';

export class GetCommentsDto extends IntersectionType(Comments, PickType(Users, ['id', 'userName', 'imageUploads'])) {}
