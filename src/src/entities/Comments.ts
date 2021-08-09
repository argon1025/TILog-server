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

@Index("FK_comments_usersID_users_id", ["usersId"], {})
@Index("FK_comments_postsID_posts_id", ["postsId"], {})
@Entity("comments", { schema: "tilog" })
export class Comments {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "ì½”ë©˜íŠ¸ ì•„ì´ë””",
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

  @Column("varchar", { name: "htmlContent", comment: "ì½”ë©˜íŠ¸", length: 300 })
  htmlContent: string;

  @Column("bigint", {
    name: "replyTo",
    nullable: true,
    comment: "ë‹µê¸€ PK, ì•„ë‹ê²½ìš° NULL",
  })
  replyTo: string | null;

  @Column("tinyint", {
    name: "replyLevel",
    comment: "ë£¨íŠ¸ ì½”ë©˜íŠ¸ íŒë³„ 0,1",
    default: () => "'0'",
  })
  replyLevel: number;

  @Column("datetime", { name: "createdAt", comment: "ì½”ë©˜íŠ¸ ìƒì„±ì¼" })
  createdAt: Date;

  @Column("datetime", {
    name: "updatedAt",
    nullable: true,
    comment: "ì½”ë©˜íŠ¸ ìˆ˜ì •ì¼",
  })
  updatedAt: Date | null;

  @Column("datetime", {
    name: "deletedAt",
    nullable: true,
    comment: "ì½”ë©˜íŠ¸ ì‚­ì œì¼",
  })
  deletedAt: Date | null;

  @ManyToOne(() => Posts, (posts) => posts.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "postsID", referencedColumnName: "id" }])
  posts: Posts;

  @ManyToOne(() => Users, (users) => users.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "usersID", referencedColumnName: "id" }])
  users: Users;
}
