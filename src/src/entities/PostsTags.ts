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
    comment: "í¬ìŠ¤íŠ¸íƒœê·¸ ê´€ê³„ PK",
  })
  id: string;

  @Column("bigint", { name: "postsID", comment: "í¬ìŠ¤íŠ¸ ì•„ì´ë””" })
  postsId: string;

  @Column("bigint", { name: "tagsID", comment: "íƒœê·¸ ì•„ì´ë””" })
  tagsId: string;

  @Column("datetime", { name: "createdAt", comment: "í¬ìŠ¤íŠ¸ í…Œê·¸ ìƒì„±ì¼" })
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
