import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async findByName({ title }: Category): Promise<Category | null> {
    const titleCategory = await this.findOne({ title });

    return titleCategory || null;
  }
}
export default CategoryRepository;
