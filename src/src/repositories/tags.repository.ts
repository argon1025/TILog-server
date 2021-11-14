import { Tags } from 'src/entities/Tags';
import { CreateTagDto } from 'src/tags/dto/Tags.Create.DTO';
import { EntityManager, EntityRepository, getConnection, getManager, Repository } from 'typeorm';

@EntityRepository(Tags)
export class TagsRepository extends Repository<Tags> {
  public async createTag(createTag: CreateTagDto) {
    await getConnection().transaction(async (entityManager: EntityManager) => {
      const tag = entityManager.create(Tags, createTag);
      return await entityManager.save(tag);
    });
  }
}
