import { CacheModule, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { Tags } from 'src/entities/Tags';
import { PostsTags } from 'src/entities/PostsTags';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, PostsTags]), CacheManagerModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
