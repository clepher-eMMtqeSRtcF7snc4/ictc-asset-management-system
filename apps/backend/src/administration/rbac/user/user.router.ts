import { UserRbacService } from './user.service';
import { Ctx, Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  userWithRolesSchema,
  assignRoleInputSchema,
  rbacRoleSchema,
  roleStatusSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';
import { AppContext } from '../../../app.context.interface';

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const createUserOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const currentUserOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  employeeId: z.number().int().nullable(),
  status: roleStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  roles: z.array(z.string()),
  isAdmin: z.boolean(),
});

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
    input: z.object({}),
    output: currentUserOutputSchema,
  })
  async getCurrentUser(@Ctx() ctx: AppContext) {
    return this.userRbacService.getCurrentUser(ctx.user.id);
  }

  @Mutation({
    input: userFormSchema,
    output: createUserOutputSchema,
  })
  async createUser(@Input() input: { name: string; email: string; password: string }, @Ctx() ctx: AppContext) {
    return this.userRbacService.createUser(ctx.user.id, input);
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
