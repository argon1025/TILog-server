import { Body, Controller, Post } from '@nestjs/common';
import { CreateTagDto } from './dto/Tags.Create.DTO';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async createTag(@Body() createTag: CreateTagDto) {
    return await this.tagsService.createTag(createTag);
  }
}
