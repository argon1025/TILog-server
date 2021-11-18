import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comments } from './Comments';
import { ImageUpload } from './ImageUpload';
import { PostLike } from './PostLike';
import { Posts } from './Posts';
import { UserblogCustomization } from './UserblogCustomization';

@Entity('users', { schema: 'tilog' })
export class Users {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '데이터 베이스 유저 PK',
    unsigned: true,
  })
  @ApiProperty({
    example: '1',
    description: '유저 아이디',
    type: Number,
    required: true,
  })
  id: number;

  @Column('varchar', {
    name: 'oAuthType',
    comment: 'Oauth 로그인 타입 구분',
    length: 10,
  })
  @ApiProperty({
    example: 'github',
    description: 'Oauth 로그인 타입 구분',
    type: String,
    required: true,
  })
  oAuthType: string;

  @Column('varchar', {
    name: 'oAuthServiceID',
    comment: 'Oauth 서비스 별 고유 유저 아이디',
    length: 50,
  })
  @ApiProperty({
    example: 'MDQ6VXNlcjU2NDU5MDc5',
    description: 'Oauth 서비스 별 고유 유저 아이디',
    type: String,
    required: true,
  })
  oAuthServiceId: string;

  @Column('varchar', {
    name: 'userName',
    comment: '서비스 유저 닉네임',
    length: 50,
    default: () => "'User'",
  })
  @ApiProperty({
    example: 'MINJE-98',
    description: '서비스 유저 닉네임',
    type: String,
    required: true,
  })
  userName: string;

  @Column('varchar', {
    name: 'proFileImageURL',
    nullable: true,
    comment: '서비스 유저 프로필 이미지 링크',
    length: 300,
  })
  @ApiProperty({
    example: '',
    description: '서비스 유저 프로필 이미지 링크',
    type: String,
  })
  proFileImageUrl: string | null;

  @Column('varchar', {
    name: 'mailAddress',
    nullable: true,
    comment: '서비스 메일 주소',
    length: 50,
  })
  @ApiProperty({
    example: 'jmj012100@gmail.com',
    description: '서비스 유저 메일 주소',
    type: String,
  })
  mailAddress: string | null;

  @Column('varchar', {
    name: 'password',
    nullable: true,
    comment: '사용자 암호, Oauth 사용자는 NULL',
    length: 50,
  })
  @ApiProperty({
    example: '*******',
    description: '사용자 암호, Oauth 사용자는 NULL',
    type: String,
  })
  password: string | null;

  @Column('varchar', {
    name: 'accessToken',
    comment: '서비스 엑세스 토큰',
    length: 255,
  })
  @ApiProperty({
    example: 'gho_J2LTQG8nZxdnvow3YCd0merN3JFmEz2Yt6y',
    description: '서비스 엑세스 토큰',
    type: String,
    required: true,
  })
  accessToken: string;

  @Column('datetime', { name: 'createdAt', comment: '유저 가입일' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt', nullable: true, comment: '유저 갱신일' })
  updatedAt: Date | null;

  @Column('datetime', { name: 'deletedAt', nullable: true, comment: '유저 삭제일' })
  deletedAt: Date | null;

  @Column('tinyint', {
    name: 'admin',
    comment: '관리자 유무',
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

  @OneToOne(() => UserblogCustomization, (userblogCustomization) => userblogCustomization.users)
  userblogCustomization: UserblogCustomization;
}
