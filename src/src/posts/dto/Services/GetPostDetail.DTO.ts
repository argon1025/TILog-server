import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Users } from 'src/entities/Users';
import { Posts } from '../../../entities/Posts';

export class GetPostDetailDto extends PickType(Posts, ['id']) {}

// 유저, 포스트 테이블에 필요한 데이터 타입을 명시합니다.
class GetPostDetailNeedToUsersEntity extends PickType(Users, ['userName', 'proFileImageUrl', 'mailAddress', 'admin']) {}
class GetPostDetailNeedToPostsEntity extends PickType(Posts, [
  'id',
  'usersId',
  'categoryId',
  'title',
  'thumbNailUrl',
  'viewCounts',
  'likes',
  'markDownContent',
  'private',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}

// 두 타입을 합쳐 export 합니다.
export class GetPostDetailResponseDto extends IntersectionType(GetPostDetailNeedToUsersEntity, GetPostDetailNeedToPostsEntity) {}
