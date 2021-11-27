import { ApiProperty, PickType } from '@nestjs/swagger';
import { Posts } from '../../../entities/Posts';

// 조회 범위 오늘, 이번주, 이번달
export enum searchScope {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export class MostLikedRequestDto {
  // 페이지 커서
  public cursorNumber: number;
  // 최대 콘텐츠 갯수 제한
  public contentLimit: number;
  // 조회 범위 오늘, 이번주, 이번달
  @ApiProperty({ enum: searchScope })
  public date: searchScope;
}

export class MostLikedResponseDto {
  // 포스트 리스트
  public postListData: Posts[];
  // 페이지 커서
  public nextCursorNumber: Number;
}
