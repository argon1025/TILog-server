import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { PostView } from 'src/entities/PostView';
import { PostNotFound } from 'src/ExceptionFilters/Errors/Posts/Post.error';
import { Connection, getConnection, Repository } from 'typeorm';
import { PostDetailDto } from './dto/Posts.Detail.DTO';
import { PostsListDto } from './dto/Posts.List.DTO';

@Injectable()
export class PostsService {
  constructor(private connection: Connection) {}

  /**
   * 포스트를 작성자 데이터베이스 아이디를 요청합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostAuthor() {}

  /**
   * 포스트를 생성 합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async createPost() {}

  /**
   * 포스트를 수정 합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async updatePost() {}

  /**
   * 포스트를 삭제 합니다.
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async softDeletePost() {}

  /**
   * 포스트 조회수를 +1 합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async addPostViews() {}

  /**
   * 특정 멤버가 작성한 게시글 리스트를 요청합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostsFoundByMemberId() {}

  /**
   * 게시글 디테일 정보를 요청합니다
   * @author seongrokLee <argon1025@gmail.com>
   * @version 1.0.0
   */
  public async getPostDetail() {}
}
