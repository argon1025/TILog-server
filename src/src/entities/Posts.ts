import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comments } from "./Comments";
import { PostLike } from "./PostLike";
import { Category } from "./Category";
import { Users } from "./Users";
import { PostsTags } from "./PostsTags";

@Index("FK_posts_usersID_users_id", ["usersId"], {})
@Index("FK_posts_categoryID_category_id", ["categoryId"], {})
@Entity("posts", { schema: "tilog" })
export class Posts {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "í¬ìŠ¤íŠ¸ ì•„ì´ë””",
  })
  id: string;

  @Column("int", {
    name: "usersID",
    comment: "ìœ ì € ì•„ì´ë””",
    unsigned: true,
  })
  usersId: number;

  @Column("int", {
    name: "categoryID",
    comment: "ì¹´í…Œê³ ë¦¬ ì•„ì´ë””",
    unsigned: true,
  })
  categoryId: number;

  @Column("varchar", { name: "title", comment: "ê²Œì‹œê¸€ ì œëª©", length: 50 })
  title: string;

  @Column("varchar", {
    name: "thumbNaillURL",
    nullable: true,
    comment: "ì¸ë„¤ì¼ ì´ë¯¸ì§€ URL",
    length: 300,
  })
  thumbNaillUrl: string | null;

  @Column("int", {
    name: "viewcounts",
    comment: "ì¡°íšŒìˆ˜",
    unsigned: true,
    default: () => "'0'",
  })
  viewcounts: number;

  @Column("int", {
    name: "lkes",
    comment: "ì¢‹ì•„ìš”",
    unsigned: true,
    default: () => "'0'",
  })
  lkes: number;

  @Column("mediumtext", {
    name: "markDownContent",
    nullable: true,
    comment: "ë§ˆí¬ ë‹¤ìš´ í˜•ì‹ì˜ ë³¸ë¬¸",
  })
  markDownContent: string | null;

  @Column("tinyint", {
    name: "private",
    comment: "ë¹„ë°€ê¸€ ì—¬ë¶€",
    default: () => "'0'",
  })
  private: number;

  @Column("datetime", {
    name: "createdAt",
    comment: "ê²Œì‹œê¸€ ìµœì´ˆ ìž‘ì„±ì¼",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updatedAt",
    nullable: true,
    comment: "ê²Œì‹œê¸€ ë§ˆì§€ë§‰ ì—…ë°ì´íŠ¸ì¼",
  })
  updatedAt: Date | null;

  @Column("datetime", {
    name: "deletedAt",
    nullable: true,
    comment: "ê²Œì‹œê¸€ ì‚­ì œì¼",
  })
  deletedAt: Date | null;

  @OneToMany(() => Comments, (comments) => comments.posts)
  comments: Comments[];

  @OneToMany(() => PostLike, (postLike) => postLike.posts)
  postLikes: PostLike[];

  @ManyToOne(() => Category, (category) => category.posts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "categoryID", referencedColumnName: "id" }])
  category: Category;

  @ManyToOne(() => Users, (users) => users.posts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "usersID", referencedColumnName: "id" }])
  users: Users;

  @OneToMany(() => PostsTags, (postsTags) => postsTags.posts)
  postsTags: PostsTags[];
}
