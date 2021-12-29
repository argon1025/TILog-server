import { IntersectionType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/swagger';
import { Category } from 'src/entities/Category';
import { PostsTags } from 'src/entities/PostsTags';
import { Tags } from 'src/entities/Tags';
import { UserblogCustomization } from 'src/entities/UserblogCustomization';
import { Users } from 'src/entities/Users';
import { Posts } from '../../../entities/Posts';

export class GetPostDetailDto extends PickType(Posts, ['id']) {}

class PostTagsDto extends PickType(Tags, ['id', 'createdAt', 'tagsName'] as const) {}

// 타입을 합쳐 export 합니다.
export class GetPostDetailResponseDto extends IntersectionType(
  IntersectionType(
    PickType(Users, ['userName', 'proFileImageUrl', 'mailAddress', 'admin'] as const),
    PickType(Posts, [
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
    ] as const),
  ),
  IntersectionType(
    PickType(Category, ['categoryName', 'iconUrl'] as const),
    PickType(UserblogCustomization, ['blogTitle', 'selfIntroduction', 'statusMessage'] as const),
  ),
) {
  TagData: Array<PostTagsDto>;
}
