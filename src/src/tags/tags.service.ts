import { Injectable } from '@nestjs/common';
import { Tags } from 'src/entities/Tags';
import { TagCreateFail, TagSearchFail } from 'src/ExceptionFilters/Errors/Tags/Tag.error';
import { TagsRepository } from 'src/repositories/tags.repository';
import { chosungHangul, isChosung } from 'src/utilities/hungul';
import { Like, Raw } from 'typeorm';
import { CreateTagDto } from './dto/Tags.Create.DTO';

@Injectable()
export class TagsService {
  constructor(private tagsRepositories: TagsRepository) {}

  /**
   * 태그 생성
   * @param createTag
   * @returns Promise<boolean>
   */
  public async createTag(createTag: CreateTagDto): Promise<boolean> {
    try {
      await this.tagsRepositories.createTag(createTag);
      return true;
    } catch (error) {
      throw new TagCreateFail(`${TagsService.name}.${this.createTag.name}: ${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }

  public async getTags(tagsName: string) {
    try {
      /* 한글 자음 추출 */
      const chosungStr = chosungHangul(tagsName);

      /* 한글 초성일 경우 */
      if (isChosung(tagsName, chosungStr)) {
        return await this.tagsRepositories.createQueryBuilder().where(`fn_choSearch(tagsName) LIKE concat('%', '${tagsName.trim()}', '%')`).getMany();
      } else {
        /* 초성이 아닐 경우 */
        return await this.tagsRepositories.find({
          tagsName: Like(`%${tagsName}%`),
        });
      }
    } catch (error) {
      throw new TagSearchFail(`${TagsService.name}.${this.getTags.name}: ${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
}
