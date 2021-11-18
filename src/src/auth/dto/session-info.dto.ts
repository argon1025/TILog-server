import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

export class SessionInfo extends PickType(Users, [
  'id',
  'oAuthType',
  'oAuthServiceId',
  'userName',
  'mailAddress',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'admin',
]) {}
