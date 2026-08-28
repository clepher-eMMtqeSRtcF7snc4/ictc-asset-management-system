import { AssetConditionService } from './asset-condition.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  CreateAssetConditionInputSchema,
  UpdateAssetConditionInputSchema,
  assetConditionSchema,
  CreateAssetConditionInput,
  UpdateAssetConditionInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class AssetConditionRouter {
  constructor(private readonly assetConditionService: AssetConditionService) {}

  @Mutation({ input: CreateAssetConditionInputSchema })
  async create(
    @Input() createSettingsAssetConditionInput: CreateAssetConditionInput,
  ) {
    return this.assetConditionService.create(createSettingsAssetConditionInput);
  }

  @Mutation({ input: UpdateAssetConditionInputSchema })
  async update(
    @Input() updateSettingsAssetConditionInput: UpdateAssetConditionInput,
  ) {
    const id = updateSettingsAssetConditionInput.id;
    if (!id) {
      throw new Error('Asset condition ID is required for update');
    }
    return this.assetConditionService.update({ ...updateSettingsAssetConditionInput, id });
  }

  @Mutation({ input: assetConditionSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.assetConditionService.delete(input.id);
  }

  @Query({
    input: assetConditionSchema.pick({ id: true }),
    output: assetConditionSchema,
  })
  async getAssetConditionById(@Input() input: { id: number }) {
    return this.assetConditionService.findById(input.id);
  }

  @Query({
    input: z.object({
      search: z.string().trim().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      page: z.number().int().min(1).optional(),
      pageSize: z.number().int().min(1).max(100).optional(),
    }).default({}),
    output: z.object({
      items: z.array(assetConditionSchema),
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      pageSize: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
    }),
  })
  async getAssetConditions(
    @Input()
    input: {
      search?: string;
      status?: 'active' | 'inactive';
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.assetConditionService.findAll(input);
  }
}