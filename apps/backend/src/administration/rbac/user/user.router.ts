import { UserRbacService } from './user.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  userWithRolesSchema,
  assignRoleInputSchema,
  rbacRoleSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class UserRbacRouter {
  constructor(private readonly userRbacService: UserRbacService) {}

  @Query({
    input: z.object({
      search: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      roleId: z.string().uuid().optional(),
      page: z.number().int().positive().default(1),
      pageSize: z.number().int().positive().default(10),
    }),
    output: z.object({
      data: z.array(userWithRolesSchema),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
    }),
  })
  async getUsers(@Input() input: any) {
    return this.userRbacService.findUsers(input);
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: z.array(rbacRoleSchema),
  })
  async getUserRoles(@Input() input: { id: string }) {
    return this.userRbacService.getUserRoles(input.id);
  }

  @Mutation({
    input: assignRoleInputSchema,
  })
  async assignRoleToUser(@Input() input: { userId: string; roleId: string }) {
    return this.userRbacService.assignRoleToUser(input.userId, input.roleId);
  }

  @Mutation({
    input: z.object({
      userId: z.string(),
      roleId: z.string().uuid(),
    }),
  })
  async removeRoleFromUser(@Input() input: { userId: string; roleId: string }) {
    return this.userRbacService.removeRoleFromUser(input.userId, input.roleId);
  }
}
