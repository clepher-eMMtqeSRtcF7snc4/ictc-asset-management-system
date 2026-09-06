import { RoleService } from './role.service';
import { Ctx, Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  rbacRoleSchema,
  createRoleInputSchema,
  updateRoleInputSchema,
  rbacPermissionSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';
import { AppContext } from '../../../app.context.interface';
import { RbacService } from '../authorization/rbac.service';
import { ForbiddenException } from '@nestjs/common';

export type Role = z.infer<typeof rbacRoleSchema>;
export type Permission = z.infer<typeof rbacPermissionSchema>;

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class RoleRouter {
  constructor(
    private readonly roleService: RoleService,
    private readonly rbacService: RbacService,
  ) {}

  @Query({ input: z.object({}), output: z.array(z.string()) })
  async getModules(@Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'role.read');
    return this.roleService.getModules();
  }

  @Query({
    input: z.object({
      search: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional(),
      page: z.number().int().positive().default(1),
      pageSize: z.number().int().positive().default(10),
    }),
    output: z.object({
      data: z.array(rbacRoleSchema),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
    }),
  })
  async getRoles(@Input() input: any, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'role.read');
    return this.roleService.findRoles(input);
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: rbacRoleSchema,
  })
  async getRoleById(@Input() input: { id: string }, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'role.read');
    return this.roleService.findRoleById(input.id);
  }

  @Mutation({
    input: createRoleInputSchema,
    output: rbacRoleSchema,
  })
  async createRole(@Input() input: any, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'role.create');
    return this.roleService.createRole(input);
  }

  @Mutation({
    input: updateRoleInputSchema,
    output: rbacRoleSchema,
  })
  async updateRole(@Input() input: any, @Ctx() ctx: AppContext) {
    const { id, ...data } = input;
    await this.checkPermission(ctx, 'role.update');
    return this.roleService.updateRole(id, data);
  }

  @Mutation({ input: z.object({ id: z.string() }) })
  async deleteRole(@Input() input: { id: string }, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'role.delete');
    return this.roleService.deleteRole(input.id);
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: z.array(rbacPermissionSchema),
  })
  async getRolePermissions(
    @Input() input: { id: string },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'role.read');
    return this.roleService.getRolePermissions(input.id);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      permissionIds: z.array(z.string().uuid()),
    }),
    output: z.array(rbacPermissionSchema),
  })
  async syncRolePermissions(
    @Input() input: { id: string; permissionIds: string[] },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'role.manage');
    return this.roleService.syncRolePermissions(input.id, input.permissionIds);
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
