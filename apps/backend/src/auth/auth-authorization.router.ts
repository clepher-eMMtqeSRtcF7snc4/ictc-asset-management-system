import {
  Ctx,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { z } from 'zod';
import { AuthTrpcMiddleware } from '../auth-trpc.middleware';
import { RbacService } from '../../administration/rbac/authorization/rbac.service';
import { AppContext } from '../../app.context.interface';

const authorizationOutputSchema = z.object({
  userId: z.string(),
  roles: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
    }),
  ),
  permissions: z.array(z.string()),
  isSuperAdmin: z.boolean(),
  isAdmin: z.boolean(),
});

export type AuthorizationOutput = z.infer<typeof authorizationOutputSchema>;

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class AuthAuthorizationRouter {
  constructor(private readonly rbacService: RbacService) {}

  @Query({
    output: z.object({
      data: authorizationOutputSchema,
    }),
  })
  async getAuthorization(@Ctx() ctx: AppContext) {
    if (!ctx.user?.id) {
      throw new Error('Not authenticated');
    }

    const auth = await this.rbacService.getUserAuthorization(ctx.user.id);

    return {
      data: {
        userId: auth.userId,
        roles: auth.roles,
        permissions: Array.from(auth.permissions),
        isSuperAdmin: auth.isSuperAdmin,
        isAdmin: auth.isAdmin,
      },
    };
  }
}