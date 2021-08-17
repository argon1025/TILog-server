import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PinnedRepositoryCategories } from "./PinnedRepositoryCategories";

@Entity("pinnedRepositories", { schema: "tilog" })
export class PinnedRepositories {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "핀된 레포 아이디",
    unsigned: true,
  })
  id: number;

  @Column("varchar", { name: "nodeID", comment: "레포지토리 UID", length: 30 })
  nodeId: string;

  @Column("tinyint", {
    name: "processPercent",
    comment: "프로젝트 진행도",
    default: () => "'0'",
  })
  processPercent: number;

  @Column("varchar", {
    name: "demoURL",
    nullable: true,
    comment: "프로젝트 데모페이지",
    length: 300,
  })
  demoUrl: string | null;

  @Column("varchar", {
    name: "position",
    nullable: true,
    comment: "프로젝트  역할",
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
