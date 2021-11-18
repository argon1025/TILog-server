import { PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

export class UserInfo extends PickType(Users, ['oAuthServiceId', 'userName', 'proFileImageUrl', 'oAuthType', 'accessToken', 'createdAt']) {}
