import { RoleService } from './role.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  rbacRoleSchema,
  createRoleInputSchema,
  updateRoleInputSchema,
  rbacPermissionSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';

export type Role = z.infer<typeof rbacRoleSchema>;
export type Permission = z.infer<typeof rbacPermissionSchema>;

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class RoleRouter {
  constructor(private readonly roleService: RoleService) {}

  @Query({ input: z.object({}), output: z.array(z.string()) })
  async getModules() {
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
  async getRoles(@Input() input: any) {
    return this.roleService.findRoles(input);
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: rbacRoleSchema,
  })
  async getRoleById(@Input() input: { id: string }) {
    return this.roleService.findRoleById(input.id);
  }

  @Mutation({
    input: createRoleInputSchema,
    output: rbacRoleSchema,
  })
  async createRole(@Input() input: any) {
    return this.roleService.createRole(input);
  }

  @Mutation({
    input: updateRoleInputSchema,
    output: rbacRoleSchema,
  })
  async updateRole(@Input() input: any) {
    const { id, ...data } = input;
    return this.roleService.updateRole(id, data);
  }

  @Mutation({ input: z.object({ id: z.string() }) })
  async deleteRole(@Input() input: { id: string }) {
    return this.roleService.deleteRole(input.id);
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: z.array(rbacPermissionSchema),
  })
  async getRolePermissions(@Input() input: { id: string }) {
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
  ) {
    return this.roleService.syncRolePermissions(input.id, input.permissionIds);
  }
}
