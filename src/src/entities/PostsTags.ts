import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";
import { Tags } from "./Tags";

@Index("FK_postsTags_postsID_posts_id", ["postsId"], {})
@Index("FK_postsTags_tagsID_tags_id", ["tagsId"], {})
@Entity("postsTags", { schema: "tilog" })
export class PostsTags {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "포스트태그 관계 PK",
  })
  id: string;

  @Column("bigint", { name: "postsID", comment: "포스트 아이디" })
  postsId: string;

  @Column("bigint", { name: "tagsID", comment: "태그 아이디" })
  tagsId: string;

  @Column("datetime", { name: "createdAt", comment: "포스트 테그 생성일" })
  createdAt: Date;

  @ManyToOne(() => Posts, (posts) => posts.postsTags, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "postsID", referencedColumnName: "id" }])
  posts: Posts;

  @ManyToOne(() => Tags, (tags) => tags.postsTags, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "tagsID", referencedColumnName: "id" }])
  tags: Tags;
}
