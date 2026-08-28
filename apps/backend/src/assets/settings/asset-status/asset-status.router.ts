import { AssetStatusService } from './asset-status.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  createAssetStatusInputSchema,
  updateAssetStatusInputSchema,
  settingsAssetStatusSchema,
  CreateAssetStatusInput,
  UpdateAssetStatusInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class AssetStatusRouter {
  constructor(private readonly assetStatusService: AssetStatusService) {}

  @Mutation({ input: createAssetStatusInputSchema })
  async create(
    @Input() createSettingsAssetStatusInput: CreateAssetStatusInput,
  ) {
    return this.assetStatusService.create(createSettingsAssetStatusInput);
  }

  @Mutation({ input: updateAssetStatusInputSchema })
  async update(
    @Input() updateSettingsAssetStatusInput: UpdateAssetStatusInput,
  ) {
    const id = updateSettingsAssetStatusInput.id;
    if (!id) {
      throw new Error('Asset status ID is required for update');
    }
    return this.assetStatusService.update({ ...updateSettingsAssetStatusInput, id });
  }

  @Mutation({ input: settingsAssetStatusSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.assetStatusService.delete(input.id);
  }

  @Query({
    input: settingsAssetStatusSchema.pick({ id: true }),
    output: settingsAssetStatusSchema,
  })
  async getAssetStatusById(@Input() input: { id: number }) {
    return this.assetStatusService.findById(input.id);
  }

  @Query({
    input: z.object({
      search: z.string().trim().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      page: z.number().int().min(1).optional(),
      pageSize: z.number().int().min(1).max(100).optional(),
    }).default({}),
    output: z.object({
      items: z.array(settingsAssetStatusSchema),
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      pageSize: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
    }),
  })
  async getAssetStatuses(
    @Input()
    input: {
      search?: string;
      status?: 'active' | 'inactive';
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.assetStatusService.findAll(input);
  }
}