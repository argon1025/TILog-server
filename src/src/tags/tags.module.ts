import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsRepository } from 'src/repositories/tags.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TagsRepository])],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
