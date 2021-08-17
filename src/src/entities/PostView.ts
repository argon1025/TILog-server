import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";

@Index("FK_postView_postsID_posts_id", ["postsId"], {})
@Entity("postView", { schema: "tilog" })
export class PostView {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "포스트좋아요 아이디",
  })
  id: string;

  @Column("varchar", { name: "userIP", comment: "유저 아이피", length: 16 })
  userIp: string;

  @Column("bigint", { name: "postsID", comment: "포스트 아이디" })
  postsId: string;

  @Column("datetime", { name: "viewedAt", comment: "포스트 열람일" })
  viewedAt: Date;

  @ManyToOne(() => Posts, (posts) => posts.postViews, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "postsID", referencedColumnName: "id" }])
  posts: Posts;
}
