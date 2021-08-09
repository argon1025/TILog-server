import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("FK_imageUpload_usersID_users_id", ["usersId"], {})
@Entity("imageUpload", { schema: "tilog" })
export class ImageUpload {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "ì´ë¯¸ì§€ ì—…ë¡œë“œ ì•„ì´ë””",
  })
  id: string;

  @Column("int", {
    name: "usersID",
    nullable: true,
    comment: "ìœ ì € ì•„ì´ë””",
    unsigned: true,
  })
  usersId: number | null;

  @Column("varchar", {
    name: "pathUrl",
    comment: "ì´ë¯¸ì§€ URL ì •ë³´",
    length: 300,
  })
  pathUrl: string;

  @Column("int", { name: "fileSizeBytes", comment: "íŒŒì¼ ì‚¬ì´ì¦ˆ ì •ë³´" })
  fileSizeBytes: number;

  @Column("varchar", {
    name: "fileType",
    comment: "íŒŒì¼ íƒ€ìž… ì •ë³´",
    length: 20,
  })
  fileType: string;

  @Column("datetime", { name: "createdAt", comment: "íŒŒì¼ ì—…ë¡œë“œì¼" })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.imageUploads, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "usersID", referencedColumnName: "id" }])
  users: Users;
}
