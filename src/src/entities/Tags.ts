import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsTags } from './PostsTags';

@Entity('tags', { schema: 'tilog' })
export class Tags {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: '태그 PK' })
  id: string;

  @Column('varchar', { name: 'tagsName', comment: '태그 명', length: 30 })
  @ApiProperty({
    example: '태그-1',
    description: '태그 이름',
    type: String,
    required: true,
  })
  tagsName: string;

  @Column('datetime', { name: 'createdAt', comment: '태그 생성일자' })
  createdAt: Date;

  @OneToMany(() => PostsTags, (postsTags) => postsTags.tags)
  postsTags: PostsTags[];
}
