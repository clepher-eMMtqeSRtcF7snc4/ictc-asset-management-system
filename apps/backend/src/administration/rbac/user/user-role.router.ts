import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  userWithRolesSchema,
  rbacRoleSchema,
  roleAssignmentSchema,
  userRolesOutputSchema,
  assignManyInputSchema,
  replaceInputSchema,
  userRoleActionSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';
import { AppContext } from '../../../app.context.interface';
import { UserRoleService } from './user-role.service';
import { RbacService } from '../authorization/rbac.service';
import { ForbiddenException } from '@nestjs/common';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class UserRoleRouter {
  constructor(
    private readonly userRoleService: UserRoleService,
    private readonly rbacService: RbacService,
  ) {}

  @Query({
    input: z.object({
      search: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      roleId: z.string().uuid().optional(),
      departmentId: z.number().int().positive().optional(),
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
  async list(
    @Input() input: any,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'user.read');
    return this.userRoleService.findUsersWithRoles(input);
  }

  @Query({
    input: z.object({ userId: z.string() }),
    output: userRolesOutputSchema,
  })
  async getByUserId(
    @Input() input: { userId: string },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'user.read');
    return this.userRoleService.getRolesByUserId(input.userId);
  }

  @Query({
    input: z.object({ userId: z.string() }),
    output: z.array(roleAssignmentSchema),
  })
  async getAssignmentOptions(
    @Input() input: { userId: string },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'user.read');
    return this.userRoleService.getRoleAssignmentOptions(input.userId);
  }

  @Mutation({
    input: assignManyInputSchema,
  })
  async assignMany(
    @Input() input: { userId: string; roleIds: string[] },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'user.manage');
    return this.userRoleService.assignMany(input.userId, input.roleIds);
  }

  @Mutation({
    input: userRoleActionSchema,
  })
  async assign(
    @Input() input: { userId: string; roleId: string },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'user.manage');
    return this.userRoleService.assign(input.userId, input.roleId);
  }

  @Mutation({
    input: userRoleActionSchema,
  })
  async remove(
    @Input() input: { userId: string; roleId: string },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'user.manage');
    return this.userRoleService.remove(input.userId, input.roleId);
  }

  @Mutation({
    input: replaceInputSchema,
  })
  async replace(
    @Input() input: { userId: string; roleIds: string[] },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'user.manage');
    return this.userRoleService.replace(input.userId, input.roleIds);
  }

  private async checkPermission(ctx: AppContext, permissionCode: string) {
    if (!ctx.user?.id) {
      throw new ForbiddenException('Not authenticated');
    }

    const hasPermission = await this.rbacService.hasPermission(
      ctx.user.id,
      permissionCode,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `You do not have permission: ${permissionCode}`,
      );
    }
  }
}
