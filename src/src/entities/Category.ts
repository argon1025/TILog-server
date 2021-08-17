import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PinnedRepositoryCategories } from "./PinnedRepositoryCategories";
import { Posts } from "./Posts";

@Entity("category", { schema: "tilog" })
export class Category {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "카테고리 아이디",
    unsigned: true,
  })
  id: number;

  @Column("varchar", {
    name: "categoryName",
    comment: "카테고리 명",
    length: 30,
  })
  categoryName: string;

  @Column("varchar", {
    name: "iconURL",
    nullable: true,
    comment: "커스텀 기술아이콘 컬럼",
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
