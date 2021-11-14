import { Tags } from 'src/entities/Tags';
import { CreateTagDto } from 'src/tags/dto/Tags.Create.DTO';
import { EntityManager, EntityRepository, getConnection, Repository } from 'typeorm';

@EntityRepository(Tags)
export class TagsRepository extends Repository<Tags> {
  public async createTag(createTag: CreateTagDto) {
    await getConnection().transaction(async (entityManager: EntityManager) => {
      const isTag = await entityManager.findOne(Tags, { where: { tagsName: createTag.tagsName } });

      if (isTag) {
        throw new Error('이미 존재하는 태그입니다.');
      }

      return await entityManager.save(Tags, createTag);
    });
  }
}
