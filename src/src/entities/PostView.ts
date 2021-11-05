import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './Posts';

@Index('FK_postView_postsID_posts_id', ['postsId'], {})
@Entity('postView', { schema: 'tilog' })
export class PostView {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '포스트좋아요 아이디',
  })
  @ApiProperty({
    example: '1',
    description: '포스트 조회기록 아이디',
    type: String,
    required: true,
  })
  id: string;

  @Column('varchar', { name: 'userIP', comment: '유저 아이피', length: 16 })
  @ApiProperty({
    example: '127.0.0.1',
    description: '포스트 조회기록 아이피',
    type: String,
    required: true,
  })
  userIp: string;

  @Column('bigint', { name: 'postsID', comment: '포스트 아이디' })
  @ApiProperty({
    example: '1',
    description: '포스트 아이디',
    type: String,
    required: true,
  })
  postsId: string;

  @Column('datetime', { name: 'viewedAt', comment: '포스트 열람일' })
  @ApiProperty({
    example: '2021-10-25',
    description: '포스트 열람일',
    type: String,
    required: true,
  })
  viewedAt: Date;

  @ManyToOne(() => Posts, (posts) => posts.postViews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postsID', referencedColumnName: 'id' }])
  posts: Posts;
}
