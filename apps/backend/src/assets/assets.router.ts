import { Ctx, Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  assetSchema,
  previewRegistrationIdentifiersInputSchema,
  registrationIdentifiersSchema,
  registerAssetInputSchema,
  saveAssetDraftInputSchema,
  type PreviewRegistrationIdentifiersInput,
  type RegisterAssetInput,
  type SaveAssetDraftInput,
} from '@repo/trpc/schemas';
import { AppContext } from '../app.context.interface';
import { AuthTrpcMiddleware } from '../auth/auth-trpc.middleware';
import { AssetsService } from './assets.service';

@Router({ alias: 'assetsRouter' })
@UseMiddlewares(AuthTrpcMiddleware)
export class AssetsRouter {
  constructor(private readonly assetsService: AssetsService) {}

  @Query({
    input: previewRegistrationIdentifiersInputSchema,
    output: registrationIdentifiersSchema,
  })
  async previewRegistrationIdentifiers(
    @Input() input: PreviewRegistrationIdentifiersInput,
  ) {
    return this.assetsService.previewRegistrationIdentifiers(input.categoryId);
  }

  @Mutation({ input: registerAssetInputSchema, output: assetSchema })
  async register(
    @Input() input: RegisterAssetInput,
    @Ctx() context: AppContext,
  ) {
    return this.assetsService.register(input, context.user.id);
  }

  @Mutation({ input: saveAssetDraftInputSchema, output: assetSchema })
  async saveDraft(
    @Input() input: SaveAssetDraftInput,
    @Ctx() context: AppContext,
  ) {
    return this.assetsService.saveDraft(input, context.user.id);
  }
}
