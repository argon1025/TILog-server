import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostsTags } from "./PostsTags";

@Entity("tags", { schema: "tilog" })
export class Tags {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", comment: "íƒœê·¸ PK" })
  id: string;

  @Column("varchar", { name: "tagsName", comment: "íƒœê·¸ ëª…", length: 30 })
  tagsName: string;

  @Column("datetime", { name: "createdAt", comment: "íƒœê·¸ ìƒì„±ì¼ìž" })
  createdAt: Date;

  @OneToMany(() => PostsTags, (postsTags) => postsTags.tags)
  postsTags: PostsTags[];
}
