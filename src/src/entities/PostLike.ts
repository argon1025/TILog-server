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
    comment: "í¬ìŠ¤íŠ¸ì¢‹ì•„ìš” ì•„ì´ë””",
  })
  id: string;

  @Column("int", {
    name: "usersID",
    comment: "ìœ ì € ì•„ì´ë””",
    unsigned: true,
  })
  usersId: number;

  @Column("bigint", { name: "postsID", comment: "í¬ìŠ¤íŠ¸ ì•„ì´ë””" })
  postsId: string;

  @Column("datetime", { name: "likedAt", comment: "ì¢‹ì•„ìš” ëˆ„ë¥¸ì¼" })
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
