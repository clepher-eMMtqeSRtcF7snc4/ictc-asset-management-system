import { AssetTypeService } from './asset-type.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  createSettingsAssetTypeInputSchema,
  updateSettingsAssetTypeInputSchema,
  assetTypeListOutputSchema,
  settingsAssetTypeSchema,
  CreateSettingsAssetTypeInput,
  UpdateSettingsAssetTypeInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class AssetTypeRouter {
  constructor(private readonly assetTypeService: AssetTypeService) {}

  @Mutation({ input: createSettingsAssetTypeInputSchema })
  async create(
    @Input() createSettingsAssetTypeInput: CreateSettingsAssetTypeInput,
  ) {
    return this.assetTypeService.create(createSettingsAssetTypeInput);
  }

  @Mutation({ input: updateSettingsAssetTypeInputSchema })
  async update(
    @Input() updateSettingsAssetTypeInput: UpdateSettingsAssetTypeInput,
  ) {
    const id = updateSettingsAssetTypeInput.id;
    if (!id) {
      throw new Error('Asset type ID is required for update');
    }
    return this.assetTypeService.update({ ...updateSettingsAssetTypeInput, id });
  }

  @Mutation({ input: settingsAssetTypeSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.assetTypeService.delete(input.id);
  }

  @Query({
    input: settingsAssetTypeSchema.pick({ id: true }),
    output: settingsAssetTypeSchema,
  })
  async getAssetTypeById(@Input() input: { id: number }) {
    return this.assetTypeService.findById(input.id);
  }

  @Query({
    input: z.object({
      search: z.string().trim().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      page: z.number().int().min(1).optional(),
      pageSize: z.number().int().min(1).max(100).optional(),
    }).default({}),
    output: z.object({
      items: assetTypeListOutputSchema,
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      pageSize: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
    }),
  })
  async getAssetTypes(
    @Input()
    input: {
      search?: string;
      status?: 'active' | 'inactive';
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.assetTypeService.findAll(input);
  }
}