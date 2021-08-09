import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PinnedRepositoryCategories } from "./PinnedRepositoryCategories";
import { Posts } from "./Posts";

@Entity("category", { schema: "tilog" })
export class Category {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "ì¹´í…Œê³ ë¦¬ ì•„ì´ë””",
    unsigned: true,
  })
  id: number;

  @Column("varchar", {
    name: "categoryName",
    comment: "ì¹´í…Œê³ ë¦¬ ëª…",
    length: 30,
  })
  categoryName: string;

  @Column("varchar", {
    name: "iconURL",
    nullable: true,
    comment: "ì»¤ìŠ¤í…€ ê¸°ìˆ ì•„ì´ì½˜ ì»¬ëŸ¼",
    length: 300,
  })
  iconUrl: string | null;

  @OneToMany(
    () => PinnedRepositoryCategories,
    (pinnedRepositoryCategories) => pinnedRepositoryCategories.category
  )
  pinnedRepositoryCategories: PinnedRepositoryCategories[];

  @OneToMany(() => Posts, (posts) => posts.category)
  posts: Posts[];
}
