import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { Tags } from 'src/entities/Tags';
import { PostsTags } from 'src/entities/PostsTags';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, PostsTags])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
