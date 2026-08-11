import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  categoryListInputSchema,
  categoryListOutputSchema,
  categorySchema,
  createCategoryInputSchema,
  setCategoryStatusInputSchema,
  updateCategoryInputSchema,
  type CategoryListInput,
  type CreateCategoryInput,
  type SetCategoryStatusInput,
  type UpdateCategoryInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../auth/auth-trpc.middleware';
import { CategoriesService } from './categories.service';

@Router({ alias: 'categoriesRouter' })
@UseMiddlewares(AuthTrpcMiddleware)
export class CategoriesRouter {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query({ input: categoryListInputSchema, output: categoryListOutputSchema })
  async list(@Input() input: CategoryListInput) {
    return this.categoriesService.list(input);
  }

  @Mutation({ input: createCategoryInputSchema, output: categorySchema })
  async create(@Input() input: CreateCategoryInput) {
    return this.categoriesService.create(input);
  }

  @Mutation({ input: updateCategoryInputSchema, output: categorySchema })
  async update(@Input() input: UpdateCategoryInput) {
    return this.categoriesService.update(input);
  }

  @Mutation({ input: setCategoryStatusInputSchema, output: categorySchema })
  async setStatus(@Input() input: SetCategoryStatusInput) {
    return this.categoriesService.setStatus(input);
  }
}
