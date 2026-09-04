import { PermissionService } from './permission.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  rbacPermissionSchema,
  createPermissionInputSchema,
  updatePermissionInputSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../../auth/auth-trpc.middleware';

export type Permission = z.infer<typeof rbacPermissionSchema>;

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class PermissionRouter {
  constructor(private readonly permissionService: PermissionService) {}

  @Query({ input: z.object({}), output: z.array(z.string()) })
  async getModules() {
    return this.permissionService.getModules();
  }

  @Query({
    input: z.object({
      module: z.string().optional(),
      action: z.string().optional(),
      search: z.string().optional(),
      page: z.number().int().positive().default(1),
      pageSize: z.number().int().positive().default(10),
    }),
    output: z.object({
      data: z.array(rbacPermissionSchema),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
    }),
  })
  async getPermissions(@Input() input: any) {
    return this.permissionService.findPermissions(input);
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: rbacPermissionSchema,
  })
  async getPermissionById(@Input() input: { id: string }) {
    return this.permissionService.findPermissionById(input.id);
  }

  @Mutation({
    input: createPermissionInputSchema,
    output: rbacPermissionSchema,
  })
  async createPermission(@Input() input: any) {
    return this.permissionService.createPermission(input);
  }

  @Mutation({
    input: updatePermissionInputSchema,
    output: rbacPermissionSchema,
  })
  async updatePermission(@Input() input: any) {
    const { id, ...data } = input;
    return this.permissionService.updatePermission(id, data);
  }

  @Mutation({ input: z.object({ id: z.string() }) })
  async deletePermission(@Input() input: { id: string }) {
    return this.permissionService.deletePermission(input.id);
  }
}
