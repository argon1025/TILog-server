import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/Logger.middleware';

// Load Entities
import { Category } from './entities/Category';
import { Comments } from './entities/Comments';
import { ImageUpload } from './entities/ImageUpload';
import { PinnedRepositories } from './entities/PinnedRepositories';
import { PinnedRepositoryCategories } from './entities/PinnedRepositoryCategories';
import { PostLike } from './entities/PostLike';
import { Posts } from './entities/Posts';
import { PostsTags } from './entities/PostsTags';
import { Tags } from './entities/Tags';
import { UserblogCustomization } from './entities/UserblogCustomization';
import { Users } from './entities/Users';
import { PostView } from './entities/PostView';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { FileUploadsModule } from './file-uploads/file-uploads.module';
import { UserBlogCustomizationModule } from './user-blog-customization/user-blog-customization.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';

// Load ENV
const ENV = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV.NODE_ENV ? '.env' : `.env.${ENV.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: ENV.DB_HOST,
      port: +ENV.DB_PORT,
      username: ENV.DB_USERNAME,
      password: ENV.DB_PASSWORD,
      database: ENV.DB_DATABASE,
      entities: [
        Users,
        UserblogCustomization,
        Tags,
        PostsTags,
        Posts,
        PostLike,
        PinnedRepositoryCategories,
        PinnedRepositories,
        ImageUpload,
        Comments,
        Category,
        PostView,
      ],
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
      autoLoadEntities: true,
    }),
    PostsModule,
    AuthModule,
    UsersModule,
    CommentsModule,
    FileUploadsModule,
    UserBlogCustomizationModule,
    TagsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// Add Middleware
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
