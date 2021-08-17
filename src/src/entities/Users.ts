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
    comment: "데이터 베이스 유저 PK",
    unsigned: true,
  })
  id: number;

  @Column("varchar", {
    name: "oAuthType",
    comment: "Oauth 로그인 타입 구분",
    length: 10,
  })
  oAuthType: string;

  @Column("varchar", {
    name: "oAuthServiceID",
    comment: "Oauth 서비스 별 고유 유저 아이디",
    length: 50,
  })
  oAuthServiceId: string;

  @Column("varchar", {
    name: "userName",
    comment: "서비스 유저 닉네임",
    length: 50,
    default: () => "'User'",
  })
  userName: string;

  @Column("varchar", {
    name: "proFileImageURL",
    nullable: true,
    comment: "서비스 유저 프로필 이미지 링크",
    length: 300,
  })
  proFileImageUrl: string | null;

  @Column("varchar", {
    name: "mailAddress",
    nullable: true,
    comment: "서비스 메일 주소",
    length: 50,
  })
  mailAddress: string | null;

  @Column("varchar", {
    name: "password",
    nullable: true,
    comment: "사용자 암호, Oauth 사용자는 NULL",
    length: 50,
  })
  password: string | null;

  @Column("varchar", {
    name: "accessToken",
    comment: "서비스 엑세스 토큰",
    length: 255,
  })
  accessToken: string;

  @Column("varchar", {
    name: "refreshToken",
    nullable: true,
    comment: "서비스 리프레시 토큰",
    length: 255,
  })
  refreshToken: string | null;

  @Column("datetime", { name: "createdAt", comment: "유저 가입일" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", comment: "유저 갱신일" })
  updatedAt: Date;

  @Column("datetime", { name: "deletedAt", comment: "유저 삭제일" })
  deletedAt: Date;

  @Column("tinyint", {
    name: "admin",
    comment: "관리자 유무",
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
