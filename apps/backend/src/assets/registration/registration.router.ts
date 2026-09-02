import { Ctx, Input, Mutation, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { AppContext } from '../../app.context.interface';
import {
  assetRegistrationSchema,
  type AssetRegistrationInput,
} from '@repo/trpc/schemas';
import { RegistrationService } from './registration.service';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class RegistrationRouter {
  constructor(private readonly registrationService: RegistrationService) {}

  @Mutation({ input: assetRegistrationSchema })
  async create(
    @Input() input: AssetRegistrationInput,
    @Ctx() context: AppContext,
  ) {
    return this.registrationService.create(input, context.user.id);
  }
}
