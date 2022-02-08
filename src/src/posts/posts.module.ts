import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Custom
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';

// Entities
import { Posts } from 'src/entities/Posts';
import { Tags } from 'src/entities/Tags';
import { PostsTags } from 'src/entities/PostsTags';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, PostsTags]), CacheManagerModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
