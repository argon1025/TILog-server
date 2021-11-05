import { PickType } from '@nestjs/swagger';
import { Posts } from '../../../entities/Posts';

export class GetPostsDto extends PickType(Posts, ['usersId']) {
  // 유저 본인 유무
  public personalRequest: boolean;
  // 페이지 커서
  public cursorNumber: number;
  // 최대 콘텐츠 갯수 제한
  public contentLimit: number;
}
export class GetPostsResponseDto {
  // 유저 본인 유무
  public postListData: Posts[];
  // 페이지 커서
  public nextCursorNumber: String | Number;
}
