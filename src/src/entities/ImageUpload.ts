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
    comment: "이미지 업로드 아이디",
  })
  id: string;

  @Column("int", {
    name: "usersID",
    nullable: true,
    comment: "유저 아이디",
    unsigned: true,
  })
  usersId: number | null;

  @Column("varchar", {
    name: "pathUrl",
    comment: "이미지 URL 정보",
    length: 300,
  })
  pathUrl: string;

  @Column("int", { name: "fileSizeBytes", comment: "파일 사이즈 정보" })
  fileSizeBytes: number;

  @Column("varchar", {
    name: "fileType",
    comment: "파일 타입 정보",
    length: 20,
  })
  fileType: string;

  @Column("datetime", { name: "createdAt", comment: "파일 업로드일" })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.imageUploads, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "usersID", referencedColumnName: "id" }])
  users: Users;
}
