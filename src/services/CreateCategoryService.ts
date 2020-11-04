import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const titleToUpecase = title
      .toLowerCase()
      .split(' ')
      .map(
        titleUper => titleUper.charAt(0).toUpperCase() + titleUper.substring(1),
      )
      .join(' ');

    const existsCategoryTitle = await categoryRepository.findOne({
      where: { title: titleToUpecase },
    });

    if (existsCategoryTitle) {
      return existsCategoryTitle;
    }

    const category = categoryRepository.create({ title: titleToUpecase });

    await categoryRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
