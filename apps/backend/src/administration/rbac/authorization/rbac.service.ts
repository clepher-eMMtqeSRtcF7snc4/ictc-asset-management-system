import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../../database/database.module';
import { and, eq, inArray } from 'drizzle-orm';
import { userRoles, rolePermissions } from '../../../auth/schema';
import { roles } from '../role/schemas/schema';
import { permissions } from '../permission/schemas/schema';

export interface UserAuthorization {
  userId: string;
  roles: Array<{
    id: string;
    code: string;
    name: string;
  }>;
  permissions: Set<string>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

@Injectable()
export class RbacService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getUserAuthorization(userId: string): Promise<UserAuthorization> {
    const userRoleRows = await this.database
      .select({
        roleId: roles.id,
        roleCode: roles.code,
        roleName: roles.name,
        roleStatus: roles.status,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(and(eq(userRoles.userId, userId), eq(roles.status, 'active')));

    const roleIds = userRoleRows.map((r) => r.roleId);
    let permissionSet = new Set<string>();

    if (roleIds.length > 0) {
      const permissionRows = await this.database
        .select({ permissionCode: permissions.code })
        .from(rolePermissions)
        .innerJoin(
          permissions,
          eq(rolePermissions.permissionId, permissions.id),
        )
        .where(
          and(
            inArray(rolePermissions.roleId, roleIds),
            eq(permissions.status, 'active'),
          ),
        );

      permissionSet = new Set(permissionRows.map((r) => r.permissionCode));
    }

    const isSuperAdmin = userRoleRows.some((r) => r.roleCode === 'SUPER_ADMIN');
    const isAdmin = userRoleRows.some((r) => r.roleCode === 'ADMIN');

    return {
      userId,
      roles: userRoleRows.map((r) => ({
        id: r.roleId,
        code: r.roleCode,
        name: r.roleName,
      })),
      permissions: permissionSet,
      isSuperAdmin,
      isAdmin,
    };
  }

  async hasPermission(
    userId: string,
    permissionCode: string,
  ): Promise<boolean> {
    const auth = await this.getUserAuthorization(userId);
    return auth.isSuperAdmin || auth.permissions.has(permissionCode);
  }

  async getAllActiveRoles() {
    return this.database
      .select({
        id: roles.id,
        code: roles.code,
        name: roles.name,
        description: roles.description,
      })
      .from(roles)
      .where(eq(roles.status, 'active'));
  }

  async getAllActivePermissions() {
    return this.database
      .select({
        id: permissions.id,
        code: permissions.code,
        name: permissions.name,
        description: permissions.description,
        module: permissions.module,
        action: permissions.action,
      })
      .from(permissions)
      .where(eq(permissions.status, 'active'));
  }
}
