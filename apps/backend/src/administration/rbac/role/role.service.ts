import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../../database/database.module';
import {
  and,
  asc,
  count,
  eq,
  ilike,
  inArray,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { roles, roleStatus } from './schemas/schema';
import { permissions, rolePermissions } from '../permission/schemas/schema';

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class RoleService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findRoles(input?: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.search) {
      conditions.push(
        or(
          ilike(roles.name, `%${input.search}%`),
          ilike(roles.description, `%${input.search}%`),
          ilike(roles.code, `%${input.search}%`),
        ) as SQL,
      );
    }

    if (input?.status) {
      conditions.push(eq(roles.status, input.status as 'active' | 'inactive'));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result, totalResult] = await Promise.all([
      this.database
        .select()
        .from(roles)
        .where(where)
        .orderBy(asc(roles.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ count: count() }).from(roles).where(where),
    ]);

    return {
      data: result,
      total: totalResult[0]?.count ?? 0,
      page,
      pageSize,
    };
  }

  async findRoleById(id: string) {
    const [result] = await this.database
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return result;
  }

  async findRoleByCode(code: string) {
    const [result] = await this.database
      .select()
      .from(roles)
      .where(eq(roles.code, code))
      .limit(1);

    return result || null;
  }

  async createRole(input: {
    code: string;
    name: string;
    description?: string;
    status?: 'active' | 'inactive';
    permissionIds?: string[];
  }) {
    const existing = await this.findRoleByCode(input.code);
    if (existing) {
      throw new ConflictException(
        `Role with code ${input.code} already exists`,
      );
    }

    const [role] = await this.database
      .insert(roles)
      .values({
        id: crypto.randomUUID(),
        code: input.code,
        name: input.name,
        description: input.description ?? null,
        status: input.status || 'active',
      })
      .returning();

    if (input.permissionIds && input.permissionIds.length > 0) {
      await this.database.insert(rolePermissions).values(
        input.permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
      );
    }

    return role;
  }

  async updateRole(
    id: string,
    input: {
      code?: string;
      name?: string;
      description?: string;
      status?: 'active' | 'inactive';
      permissionIds?: string[];
    },
  ) {
    const role = await this.findRoleById(id);

    if (input.code && input.code !== role.code) {
      const existing = await this.findRoleByCode(input.code);
      if (existing) {
        throw new ConflictException(
          `Role with code ${input.code} already exists`,
        );
      }
    }

    const [updated] = await this.database
      .update(roles)
      .set({
        ...(input.code !== undefined && { code: input.code }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.status !== undefined && { status: input.status }),
        updatedAt: new Date(),
      })
      .where(eq(roles.id, id))
      .returning();

    if (input.permissionIds !== undefined) {
      await this.database
        .delete(rolePermissions)
        .where(eq(rolePermissions.roleId, id));
      if (input.permissionIds.length > 0) {
        await this.database.insert(rolePermissions).values(
          input.permissionIds.map((permissionId) => ({
            roleId: id,
            permissionId,
          })),
        );
      }
    }

    return updated;
  }

  async deleteRole(id: string) {
    await this.findRoleById(id);
    await this.database
      .delete(rolePermissions)
      .where(eq(rolePermissions.roleId, id));
    await this.database.delete(roles).where(eq(roles.id, id));
  }

  async getRolePermissions(roleId: string) {
    const result = await this.database
      .select({
        id: permissions.id,
        code: permissions.code,
        name: permissions.name,
        description: permissions.description,
        module: permissions.module,
        action: permissions.action,
      })
      .from(rolePermissions)
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    return result;
  }

  async getModules() {
    const result = await this.database
      .select({ module: permissions.module })
      .from(permissions)
      .groupBy(permissions.module)
      .orderBy(asc(permissions.module));

    return result.map((r) => r.module);
  }

  async syncRolePermissions(roleId: string, permissionIds: string[]) {
    const role = await this.findRoleById(roleId);
    const roleIdValue = role.id;

    const [existingRole] = await this.database
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.id, roleId));

    if (!existingRole) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    if (permissionIds.length > 0) {
      const permissionRows = await this.database
        .select({ id: permissions.id })
        .from(permissions)
        .where(inArray(permissions.id, permissionIds));

      const foundIds = new Set(permissionRows.map((p) => p.id));
      const invalid = permissionIds.filter((id) => !foundIds.has(id));

      if (invalid.length > 0) {
        throw new NotFoundException(
          `Permissions not found: ${invalid.join(', ')}`,
        );
      }
    }

    const uniqueIds = Array.from(new Set(permissionIds));

    return await this.database.transaction(async (tx) => {
      await tx
        .delete(rolePermissions)
        .where(eq(rolePermissions.roleId, roleId));

      if (uniqueIds.length > 0) {
        await tx
          .insert(rolePermissions)
          .values(
            uniqueIds.map((permissionId) => ({
              roleId: roleIdValue,
              permissionId,
            })),
          )
          .onConflictDoNothing();
      }

      const updatedPermissions = await tx
        .select({
          id: permissions.id,
          code: permissions.code,
          name: permissions.name,
          description: permissions.description,
          module: permissions.module,
          action: permissions.action,
        })
        .from(rolePermissions)
        .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, roleId));

      return updatedPermissions;
    });
  }
}
