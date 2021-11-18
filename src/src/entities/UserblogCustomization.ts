import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Users } from './Users';

@Entity('userblogCustomization', { schema: 'tilog' })
export class UserblogCustomization {
  @Column('int', {
    primary: true,
    name: 'usersID',
    comment: '유저 아이디',
    unsigned: true,
  })
  @ApiProperty({
    example: '1',
    description: '유저 아이디',
    type: Number,
    required: true,
  })
  usersId: number;

  @Column('varchar', {
    name: 'blogTitle',
    nullable: true,
    comment: '블로그 타이틀',
    length: 20,
  })
  @ApiProperty({
    example: 'My Blog',
    description: '블로그 타이틀',
    type: String,
  })
  blogTitle: string | null;

  @Column('varchar', {
    name: 'statusMessage',
    nullable: true,
    comment: '상태메시지',
    length: 30,
  })
  @ApiProperty({
    example: '공부중',
    description: '블로그 상태메시지',
    type: String,
  })
  statusMessage: string | null;

  @Column('varchar', {
    name: 'selfIntroduction',
    nullable: true,
    comment: '자기소개',
    length: 300,
  })
  @ApiProperty({
    example: '코딩을 즐기는  사람',
    description: '블로그 자기소개',
    type: String,
  })
  selfIntroduction: string | null;

  @OneToOne(() => Users, (users) => users.userblogCustomization, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'usersID', referencedColumnName: 'id' }])
  users: Users;
}
