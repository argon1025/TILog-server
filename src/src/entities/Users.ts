import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comments } from "./Comments";
import { ImageUpload } from "./ImageUpload";
import { PostLike } from "./PostLike";
import { Posts } from "./Posts";
import { UserblogCustomization } from "./UserblogCustomization";

@Entity("users", { schema: "tilog" })
export class Users {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id",
    comment: "ë°ì´í„° ë² ì´ìŠ¤ ìœ ì € PK",
    unsigned: true,
  })
  id: number;

  @Column("varchar", {
    name: "oAuthType",
    comment: "Oauth ë¡œê·¸ì¸ íƒ€ìž… êµ¬ë¶„",
    length: 10,
  })
  oAuthType: string;

  @Column("varchar", {
    name: "oAuthServiceID",
    comment: "Oauth ì„œë¹„ìŠ¤ ë³„ ê³ ìœ  ìœ ì € ì•„ì´ë””",
    length: 50,
  })
  oAuthServiceId: string;

  @Column("varchar", {
    name: "userName",
    comment: "ì„œë¹„ìŠ¤ ìœ ì € ë‹‰ë„¤ìž„",
    length: 50,
    default: () => "'User'",
  })
  userName: string;

  @Column("varchar", {
    name: "proFileImageURL",
    nullable: true,
    comment: "ì„œë¹„ìŠ¤ ìœ ì € í”„ë¡œí•„ ì´ë¯¸ì§€ ë§í¬",
    length: 300,
  })
  proFileImageUrl: string | null;

  @Column("varchar", {
    name: "mailAddress",
    nullable: true,
    comment: "ì„œë¹„ìŠ¤ ë©”ì¼ ì£¼ì†Œ",
    length: 50,
  })
  mailAddress: string | null;

  @Column("varchar", {
    name: "password",
    nullable: true,
    comment: "ì‚¬ìš©ìž ì•”í˜¸, Oauth ì‚¬ìš©ìžëŠ” NULL",
    length: 50,
  })
  password: string | null;

  @Column("datetime", { name: "createdAt", comment: "ìœ ì € ê°€ìž…ì¼" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", comment: "ìœ ì € ê°±ì‹ ì¼" })
  updatedAt: Date;

  @Column("datetime", { name: "deletedAt", comment: "ìœ ì € ì‚­ì œì¼" })
  deletedAt: Date;

  @Column("tinyint", {
    name: "admin",
    comment: "ê´€ë¦¬ìž ìœ ë¬´",
    default: () => "'0'",
  })
  admin: number;

  @OneToMany(() => Comments, (comments) => comments.users)
  comments: Comments[];

  @OneToMany(() => ImageUpload, (imageUpload) => imageUpload.users)
  imageUploads: ImageUpload[];

  @OneToMany(() => PostLike, (postLike) => postLike.users)
  postLikes: PostLike[];

  @OneToMany(() => Posts, (posts) => posts.users)
  posts: Posts[];

  @OneToOne(
    () => UserblogCustomization,
    (userblogCustomization) => userblogCustomization.users
  )
  userblogCustomization: UserblogCustomization;
}
