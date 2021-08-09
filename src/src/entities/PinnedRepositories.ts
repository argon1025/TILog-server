import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PinnedRepositoryCategories } from "./PinnedRepositoryCategories";

@Entity("pinnedRepositories", { schema: "tilog" })
export class PinnedRepositories {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "í•€ëœ ë ˆí¬ ì•„ì´ë””",
    unsigned: true,
  })
  id: number;

  @Column("varchar", {
    name: "nodeID",
    comment: "ë ˆí¬ì§€í† ë¦¬ UID",
    length: 30,
  })
  nodeId: string;

  @Column("tinyint", {
    name: "processPercent",
    comment: "í”„ë¡œì íŠ¸ ì§„í–‰ë„",
    default: () => "'0'",
  })
  processPercent: number;

  @Column("varchar", {
    name: "demoURL",
    nullable: true,
    comment: "í”„ë¡œì íŠ¸ ë°ëª¨íŽ˜ì´ì§€",
    length: 300,
  })
  demoUrl: string | null;

  @Column("varchar", {
    name: "position",
    nullable: true,
    comment: "í”„ë¡œì íŠ¸  ì—­í• ",
    length: 10,
  })
  position: string | null;

  @OneToMany(
    () => PinnedRepositoryCategories,
    (pinnedRepositoryCategories) =>
      pinnedRepositoryCategories.pinnedRepositories
  )
  pinnedRepositoryCategories: PinnedRepositoryCategories[];
}
