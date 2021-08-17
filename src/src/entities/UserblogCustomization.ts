import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Users } from "./Users";

@Entity("userblogCustomization", { schema: "tilog" })
export class UserblogCustomization {
  @Column("int", {
    primary: true,
    name: "usersID",
    comment: "유저 아이디",
    unsigned: true,
  })
  usersId: number;

  @Column("varchar", {
    name: "blogTitle",
    nullable: true,
    comment: "블로그 타이틀",
    length: 20,
  })
  blogTitle: string | null;

  @Column("varchar", {
    name: "statusMessage",
    nullable: true,
    comment: "상태메시지",
    length: 30,
  })
  statusMessage: string | null;

  @Column("varchar", {
    name: "selfIntroduction",
    nullable: true,
    comment: "자기소개",
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
