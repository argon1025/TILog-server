import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";
import { Users } from "./Users";

@Index("FK_postLike_postsID_posts_id", ["postsId"], {})
@Index("FK_postLike_usersID_users_id", ["usersId"], {})
@Entity("postLike", { schema: "tilog" })
export class PostLike {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "포스트좋아요 아이디",
  })
  id: string;

  @Column("int", { name: "usersID", comment: "유저 아이디", unsigned: true })
  usersId: number;

  @Column("bigint", { name: "postsID", comment: "포스트 아이디" })
  postsId: string;

  @Column("datetime", { name: "likedAt", comment: "좋아요 누른일" })
  likedAt: Date;

  @ManyToOne(() => Posts, (posts) => posts.postLikes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "postsID", referencedColumnName: "id" }])
  posts: Posts;

  @ManyToOne(() => Users, (users) => users.postLikes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "usersID", referencedColumnName: "id" }])
  users: Users;
}
