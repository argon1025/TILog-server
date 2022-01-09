import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MostLikedResponseDto, searchScope } from 'src/posts/dto/Services/MostLikedPost.DTO';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * 트랜드 포스트 데이터를 캐시에 저장합니다
   * @param requestData:{ ScopeData: searchScope; cursor: number; postListData: MostLikedResponseDto; ttl: number }
   * @returns
   */
  public setTrendPost(requestData: { ScopeData: searchScope; cursor: number; postListData: MostLikedResponseDto; ttl: number }) {
    const KEY_NAME = `TrendPost${requestData.ScopeData}:${requestData.cursor}`;
    return this.cacheManager.set(KEY_NAME, requestData.postListData, { ttl: requestData.ttl });
  }

  /**
   * 캐시에 저장된 트랜드 포스트 데이터를 조회합니다
   * @param requestData:{ ScopeData: searchScope; cursor: number }
   * @returns
   */
  public getTrendPost(requestData: { ScopeData: searchScope; cursor: number }) {
    const KEY_NAME = `TrendPost${requestData.ScopeData}:${requestData.cursor}`;
    return this.cacheManager.get(KEY_NAME);
  }
}
