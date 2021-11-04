import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { PostView } from 'src/entities/PostView';
import { Posts } from '../../../entities/Posts';

// 포스트 테이블에서 필요한 데이터 타입 명시
class PostViewCountNeedToPostsEntity extends PickType(Posts, ['id']) {}

// 포스트 뷰 테이블에서 필요한 데이터 타입 명시
class PostViewCountNeedToPostViewEntity extends PickType(PostView, ['userIp']) {}

// 두 타입을 합쳐 export 합니다.
export class AddPostViewCountDto extends IntersectionType(PostViewCountNeedToPostsEntity, PostViewCountNeedToPostViewEntity) {}
