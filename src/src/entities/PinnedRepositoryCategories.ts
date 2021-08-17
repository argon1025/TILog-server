import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { PinnedRepositories } from "./PinnedRepositories";

@Index(
  "FK_pinnedRepositoryCategories_pinnedRepositoriesID_pinnedReposit",
  ["pinnedRepositoriesId"],
  {}
)
@Index(
  "FK_pinnedRepositoryCategories_categoryID_category_id",
  ["categoryId"],
  {}
)
@Entity("pinnedRepositoryCategories", { schema: "tilog" })
export class PinnedRepositoryCategories {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "핀된 레포 카테고리 아이디",
    unsigned: true,
  })
  id: number;

  @Column("int", {
    name: "categoryID",
    comment: "핀 카테고리 관계설정 PK",
    unsigned: true,
  })
  categoryId: number;

  @Column("int", {
    name: "pinnedRepositoriesID",
    comment: "핀된 레포 아이디",
    unsigned: true,
  })
  pinnedRepositoriesId: number;

  @ManyToOne(
    () => Category,
    (category) => category.pinnedRepositoryCategories,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "categoryID", referencedColumnName: "id" }])
  category: Category;

  @ManyToOne(
    () => PinnedRepositories,
    (pinnedRepositories) => pinnedRepositories.pinnedRepositoryCategories,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "pinnedRepositoriesID", referencedColumnName: "id" }])
  pinnedRepositories: PinnedRepositories;
}
