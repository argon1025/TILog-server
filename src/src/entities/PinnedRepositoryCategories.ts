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
    comment: "í•€ëœ ë ˆí¬ ì¹´í…Œê³ ë¦¬ ì•„ì´ë””",
    unsigned: true,
  })
  id: number;

  @Column("int", {
    name: "categoryID",
    comment: "í•€ ì¹´í…Œê³ ë¦¬ ê´€ê³„ì„¤ì • PK",
    unsigned: true,
  })
  categoryId: number;

  @Column("int", {
    name: "pinnedRepositoriesID",
    comment: "í•€ëœ ë ˆí¬ ì•„ì´ë””",
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
