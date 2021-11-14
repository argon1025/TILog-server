import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from './Posts';
import { Users } from './Users';

@Index('FK_comments_usersID_users_id', ['usersId'], {})
@Index('FK_comments_postsID_posts_id', ['postsId'], {})
@Entity('comments', { schema: 'tilog' })
export class Comments {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '코멘트 아이디',
  })
  @ApiProperty({
    example: '1',
    description: '코멘트 아이디',
    type: String,
    required: true,
  })
  id: string;

  @Column('int', { name: 'usersID', comment: '유저 아이디', unsigned: true })
  @ApiProperty({
    example: '1',
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

  @Column('varchar', { name: 'htmlContent', comment: '코멘트', length: 300 })
  @ApiProperty({
    example: '코멘트',
    description: '코멘트 내용',
    type: String,
    required: true,
  })
  htmlContent: string;

  @Column('bigint', {
    name: 'replyTo',
    nullable: true,
    comment: '답글 PK, 아닐경우 NULL',
  })
  @ApiProperty({
    example: '1',
    description: '부모 코멘트',
    type: String,
  })
  replyTo: string | null;

  @Column('tinyint', {
    name: 'replyLevel',
    comment: '루트 코멘트 판별 0,1',
    default: () => "'0'",
  })
  @ApiProperty({
    example: '0',
    description: '루트 코멘트 판별',
    type: String,
    required: true,
  })
  replyLevel: number;

  @CreateDateColumn()
  @ApiProperty({
    example: '2022-11-01 17:10:54',
    description: '코멘트 작성일',
    type: String,
    required: true,
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2022-11-01 17:10:54',
    description: '코멘트 수정일',
    type: String,
  })
  updatedAt: Date | null;

  @DeleteDateColumn()
  @ApiProperty({
    example: '2022-11-01 17:10:54',
    description: '코멘트 삭제일',
    type: String,
  })
  deletedAt: Date | null;

  @ManyToOne(() => Posts, (posts) => posts.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postsID', referencedColumnName: 'id' }])
  posts: Posts;

  @ManyToOne(() => Users, (users) => users.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'usersID', referencedColumnName: 'id' }])
  users: Users;

  @ManyToOne(() => Comments, (comments) => comments.parentComment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'replyTo', referencedColumnName: 'id' }])
  parentComment: Comments;

  @OneToMany(() => Comments, (comments) => comments.parentComment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  childComment: Comments[];
}
