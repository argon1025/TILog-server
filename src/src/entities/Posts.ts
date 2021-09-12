import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comments } from './Comments';
import { PostLike } from './PostLike';
import { PostView } from './PostView';
import { Category } from './Category';
import { Users } from './Users';
import { PostsTags } from './PostsTags';

@Index('FK_posts_usersID_users_id', ['usersId'], {})
@Index('FK_posts_categoryID_category_id', ['categoryId'], {})
@Entity('posts', { schema: 'tilog' })
export class Posts {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '포스트 아이디',
  })
  id: string;

  @Column('int', { name: 'usersID', comment: '유저 아이디', unsigned: true })
  usersId: number;

  @Column('int', {
    name: 'categoryID',
    comment: '카테고리 아이디',
    unsigned: true,
  })
  categoryId: number;

  @Column('varchar', { name: 'title', comment: '게시글 제목', length: 50 })
  title: string;

  @Column('varchar', {
    name: 'thumbNailURL',
    nullable: true,
    comment: '썸네일 이미지 URL',
    length: 300,
  })
  thumbNailUrl: string | null;

  @Column('int', {
    name: 'viewCounts',
    comment: '조회수',
    unsigned: true,
    default: () => "'0'",
  })
  viewCounts: number;

  @Column('int', {
    name: 'likes',
    comment: '좋아요',
    unsigned: true,
    default: () => "'0'",
  })
  likes: number;

  @Column('mediumtext', {
    name: 'markDownContent',
    nullable: true,
    comment: '마크 다운 형식의 본문',
  })
  markDownContent: string | null;

  @Column('tinyint', {
    name: 'private',
    comment: '비밀글 여부',
    default: () => "'0'",
  })
  private: number;

  @Column('datetime', { name: 'createdAt', comment: '게시글 최초 작성일' })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    nullable: true,
    comment: '게시글 마지막 업데이트일',
  })
  updatedAt: Date | null;

  @Column('datetime', {
    name: 'deletedAt',
    nullable: true,
    comment: '게시글 삭제일',
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
