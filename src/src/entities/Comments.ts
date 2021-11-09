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
  id: string;

  @Column('int', { name: 'usersID', comment: '유저 아이디', unsigned: true })
  usersId: number;

  @Column('bigint', { name: 'postsID', comment: '포스트 아이디' })
  postsId: string;

  @Column('varchar', { name: 'htmlContent', comment: '코멘트', length: 300 })
  htmlContent: string;

  @Column('bigint', {
    name: 'replyTo',
    nullable: true,
    comment: '답글 PK, 아닐경우 NULL',
  })
  replyTo: string | null;

  @Column('tinyint', {
    name: 'replyLevel',
    comment: '루트 코멘트 판별 0,1',
    default: () => "'0'",
  })
  replyLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
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
