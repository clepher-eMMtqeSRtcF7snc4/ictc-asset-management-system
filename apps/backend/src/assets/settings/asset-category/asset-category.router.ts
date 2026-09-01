import { AssetCategoryService } from './asset-category.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  settingsAssetCategorySchema,
  settingsAssetCategoryListSchema,
  settingsAssetCreateCategoryInputSchema,
  settingsAssetUpdateCategoryInputSchema,
  activeAssetCategoryListOutputSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';
import { z } from 'zod';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class AssetCategoryRouter {
  constructor(private readonly assetCategoryService: AssetCategoryService) {}

  @Mutation({ input: settingsAssetCreateCategoryInputSchema })
  async create(
    @Input() input: z.infer<typeof settingsAssetCreateCategoryInputSchema>,
  ) {
    return this.assetCategoryService.create(input);
  }

  @Mutation({ input: settingsAssetUpdateCategoryInputSchema })
  async update(
    @Input() input: z.infer<typeof settingsAssetUpdateCategoryInputSchema>,
  ) {
    return this.assetCategoryService.update(input);
  }

  @Mutation({ input: settingsAssetCategorySchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.assetCategoryService.delete(input.id);
  }

  @Query({
    input: z.object({ id: z.number().int().positive() }),
    output: settingsAssetCategorySchema,
  })
  async getCategoryById(@Input() input: { id: number }) {
    return this.assetCategoryService.findById(input.id);
  }

  @Query({
    input: z
      .object({
        search: z.string().trim().optional(),
        status: z.enum(['active', 'inactive']).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({}),
    output: settingsAssetCategoryListSchema,
  })
  async getCategories(@Input() input: any) {
    return this.assetCategoryService.findAll(input);
  }

  @Query({
    output: activeAssetCategoryListOutputSchema,
  })
  async getActiveCategories() {
    return this.assetCategoryService.findActive();
  }
}
