import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './Posts';
import { Users } from './Users';

@Index('FK_postLike_postsID_posts_id', ['postsId'], {})
@Index('FK_postLike_usersID_users_id', ['usersId'], {})
@Entity('postLike', { schema: 'tilog' })
export class PostLike {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '포스트좋아요 아이디',
  })
  @ApiProperty({
    example: '1',
    description: '좋아요 기록 아이디',
    type: String,
    required: true,
  })
  id: string;

  @Column('int', { name: 'usersID', comment: '유저 아이디', unsigned: true })
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
    type: Number,
    required: true,
  })
  usersId: number;

  @Column('bigint', { name: 'postsID', comment: '포스트 아이디' })
  @ApiProperty({
    example: '1',
    description: '포스트 아이디',
    type: String,
    required: true,
  })
  postsId: string;

  @Column('datetime', { name: 'likedAt', comment: '좋아요 누른일' })
  @ApiProperty({
    example: '2021-10-25',
    description: '좋아요 등록일',
    type: String,
    required: true,
  })
  likedAt: Date;

  @ManyToOne(() => Posts, (posts) => posts.postLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postsID', referencedColumnName: 'id' }])
  posts: Posts;

  @ManyToOne(() => Users, (users) => users.postLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'usersID', referencedColumnName: 'id' }])
  users: Users;
}
