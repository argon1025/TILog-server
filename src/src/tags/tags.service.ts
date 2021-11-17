import { Injectable } from '@nestjs/common';
import { TagCreateFail } from 'src/ExceptionFilters/Errors/Tags/Tag.error';
import { TagsRepository } from 'src/repositories/tags.repository';
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
}
