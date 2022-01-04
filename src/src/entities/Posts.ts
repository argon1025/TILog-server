import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comments } from './Comments';
import { PostLike } from './PostLike';
import { PostView } from './PostView';
import { Category } from './Category';
import { Users } from './Users';
import { PostsTags } from './PostsTags';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString, MinLength, MaxLength, IsPositive, Min, Max, IsOptional } from 'class-validator';

@Index('FK_posts_usersID_users_id', ['usersId'], {})
@Index('FK_posts_categoryID_category_id', ['categoryId'], {})
@Entity('posts', { schema: 'tilog' })
export class Posts {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '포스트 아이디',
  })
  @ApiProperty({
    example: '1',
    description: '포스트 아이디',
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

  @Column('int', {
    name: 'categoryID',
    comment: '카테고리 아이디',
    unsigned: true,
  })
  @ApiProperty({
    example: '1',
    description: '카테고리 아이디',
    type: Number,
    required: true,
  })
  @IsInt() // Number
  @IsNotEmpty() // Not Null
  @IsPositive() // +
  categoryId: number;

  @Column('varchar', { name: 'title', comment: '게시글 제목', length: 50 })
  @ApiProperty({
    example: 'Title example',
    description: '포스트 타이틀',
    type: String,
    required: true,
  })
  @IsNotEmpty() // Not null
  @IsString() // string
  @MinLength(1) // min length
  @MaxLength(49) // max length
  title: string;

  @Column('varchar', {
    name: 'thumbNailURL',
    nullable: true,
    comment: '썸네일 이미지 URL',
    length: 300,
  })
  @ApiProperty({
    example: 'thumbNailUrl.com',
    description: '썸네일 URL',
    type: [String, null],
    required: true,
  })
  @IsOptional()
  @IsString() // string
  @MaxLength(299) // max length
  thumbNailUrl: string | null;

  @Column('int', {
    name: 'viewCounts',
    comment: '조회수',
    unsigned: true,
    default: () => "'0'",
  })
  @ApiProperty({
    example: 1,
    description: '조회수',
    type: Number,
    required: true,
  })
  viewCounts: number;

  @Column('int', {
    name: 'likes',
    comment: '좋아요',
    unsigned: true,
    default: () => "'0'",
  })
  @ApiProperty({
    example: 0,
    description: '좋아요',
    type: Number,
    required: true,
  })
  likes: number;

  @Column('mediumtext', {
    name: 'markDownContent',
    nullable: true,
    comment: '마크 다운 형식의 본문',
  })
  @ApiProperty({
    example: 'markDownContent Example',
    description: '본문',
    type: [String, null],
    required: true,
  })
  @IsNotEmpty() // Not null
  @IsString() // string
  @MaxLength(17000) // max length
  markDownContent: string | null;

  @Column('tinyint', {
    name: 'private',
    comment: '비밀글 여부',
    default: () => "'0'",
  })
  @ApiProperty({
    example: 0,
    description: '비밀글 여부',
    type: Number,
    required: true,
  })
  @IsInt() // Number
  @IsNotEmpty() // Not Null
  @Min(0)
  @Max(1)
  private: number;

  @Column('datetime', { name: 'createdAt', comment: '게시글 최초 작성일' })
  @ApiProperty({
    example: '2021-10-25',
    description: '게시글 최초 작성일',
    type: String,
    required: true,
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    nullable: true,
    comment: '게시글 마지막 업데이트일',
  })
  @ApiProperty({
    example: '2021-10-25',
    description: '게시글 마지막 업데이트일',
    type: [String, null],
    required: true,
  })
  updatedAt: Date | null;

  @Column('datetime', {
    name: 'deletedAt',
    nullable: true,
    comment: '게시글 삭제일',
  })
  @ApiProperty({
    example: '2021-10-25',
    description: '게시글 삭제일',
    type: [String, null],
    required: true,
  })
  deletedAt: Date | null;

  @OneToMany(() => Comments, (comments) => comments.posts)
  comments: Comments[];

  @OneToMany(() => PostLike, (postLike) => postLike.posts)
  postLikes: PostLike[];

  @OneToMany(() => PostView, (postView) => postView.posts)
  postViews: PostView[];

  @ManyToOne(() => Category, (category) => category.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'categoryID', referencedColumnName: 'id' }])
  category: Category;

  @ManyToOne(() => Users, (users) => users.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'usersID', referencedColumnName: 'id' }])
  users: Users;

  @OneToMany(() => PostsTags, (postsTags) => postsTags.posts)
  postsTags: PostsTags[];
}
