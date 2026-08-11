import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { AuthTrpcMiddleware } from '../auth-trpc.middleware';
import { UsersService } from './users.service';
import {
  UpdateProfileInput,
  updateProfileSchema,
  UserIdInput,
  userIdSchema,
  userProfileSchema,
} from '@repo/trpc/schemas';
import { AppContext } from '../../app.context.interface';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({ input: updateProfileSchema })
  async updateProfile(
    @Input() input: UpdateProfileInput,
    @Ctx() context: AppContext,
  ) {
    return this.usersService.updateProfile(context.user.id, input);
  }

  @Query({ input: userIdSchema, output: userProfileSchema })
  async getUserProfile(
    @Input() input: UserIdInput,
    @Ctx() context: AppContext,
  ) {
    return this.usersService.getUserProfile(input.userId, context.user.id);
  }
}
