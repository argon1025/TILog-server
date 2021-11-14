import { Injectable } from '@nestjs/common';
import { TagsRepository } from 'src/repositories/tags.repository';
import { CreateTagDto } from './dto/Tags.Create.DTO';

@Injectable()
export class TagsService {
  constructor(private tagsRepositories: TagsRepository) {}

  /**
   * tag 만들기
   * @param createTag
   * @returns
   */
  public async createTag(createTag: CreateTagDto) {
    try {
      await this.tagsRepositories.createTag(createTag);
      return true;
    } catch (error) {
      return false;
    }
  }
}
