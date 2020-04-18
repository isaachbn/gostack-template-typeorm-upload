import { Repository, getRepository } from 'typeorm';
import Category from '../models/Category';

interface CategoryCreateName {
  category: string;
}

class CreateCategoryByNameService {
  private categoriesRepository: Repository<Category>;

  private category: Category;

  constructor() {
    this.categoriesRepository = getRepository(Category);
  }

  public async execute({ category }: CategoryCreateName): Promise<Category> {
    try {
      this.category = await this.categoriesRepository.findOneOrFail({
        where: { title: category },
      });
    } catch {
      this.category = this.categoriesRepository.create({ title: category });
      await this.categoriesRepository.save(this.category);
    }

    return this.category;
  }
}

export default CreateCategoryByNameService;
