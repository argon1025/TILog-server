import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Users } from "./Users";

@Entity("userblogCustomization", { schema: "tilog" })
export class UserblogCustomization {
  @Column("int", {
    primary: true,
    name: "usersID",
    comment: "ìœ ì € ì•„ì´ë””",
    unsigned: true,
  })
  usersId: number;

  @Column("varchar", {
    name: "blogTitle",
    nullable: true,
    comment: "ë¸”ë¡œê·¸ íƒ€ì´í‹€",
    length: 20,
  })
  blogTitle: string | null;

  @Column("varchar", {
    name: "statusMessage",
    nullable: true,
    comment: "ìƒíƒœë©”ì‹œì§€",
    length: 30,
  })
  statusMessage: string | null;

  @Column("varchar", {
    name: "selfIntroduction",
    nullable: true,
    comment: "ìžê¸°ì†Œê°œ",
    length: 300,
  })
  selfIntroduction: string | null;

  @OneToOne(() => Users, (users) => users.userblogCustomization, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "usersID", referencedColumnName: "id" }])
  users: Users;
}
