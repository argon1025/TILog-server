import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entities/Posts';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Posts) private PostsRepository: Repository<Posts>) {}

  // 게시글 생성
  public createPost(userID: number, categoryID: number, title: string, thumbnailURL: string, markDownContent: string, isPrivate: boolean) {}
  // 게시글 수정
  public modifyPostByPostID(personalRequest: boolean, postID: number, categoryID: number, title: string, thumbnailURL: string, markDownContent: string, isPrivate: boolean) {}
  // 게시글 리스트 리턴
  public getPostsByUserID(personalRequest: boolean, userID: number, cursorNumber: number, contentLimit: number) {}
  // 게시글 상세보기
  public getPostDetailByPostID(personalRequest: boolean, postID: number) {}
  // 게시글 삭제
  public softDeletePostByPostID(personalRequest: boolean, postID: number) {}
}
