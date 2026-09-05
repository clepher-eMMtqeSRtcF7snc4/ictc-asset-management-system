import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../../database/database.module';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { user, userRoles, userAuditLogs } from '../../../auth/schema';
import { roles } from '../role/schemas/schema';
import { rolePermissions, permissions } from '../permission/schemas/schema';
import { employee } from '../../employee/schemas/schema';
import { department } from '../../department/schemas/schema';

@Injectable()
export class UserRoleService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findUsersWithRoles(input?: {
    search?: string;
    status?: string;
    roleId?: string;
    departmentId?: number;
    page?: number;
    pageSize?: number;
  }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.search) {
      conditions.push(
        or(
          ilike(sql`lower(${user.name})`, `%${input.search.toLowerCase()}%`),
          ilike(sql`lower(${user.email})`, `%${input.search.toLowerCase()}%`),
        ) as SQL,
      );
    }

    if (input?.status) {
      conditions.push(eq(user.status, input.status as 'active' | 'inactive'));
    }

    if (input?.departmentId) {
      conditions.push(eq(employee.departmentId, input.departmentId));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result, totalResult] = await Promise.all([
      this.database
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          employeeId: user.employeeId,
          departmentId: department.id,
          departmentName: department.name,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .leftJoin(employee, eq(user.employeeId, employee.id))
        .leftJoin(department, eq(employee.departmentId, department.id))
        .where(where)
        .orderBy(asc(user.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database
        .select({ count: count() })
        .from(user)
        .leftJoin(employee, eq(user.employeeId, employee.id))
        .where(where),
    ]);

    const userIds = result.map((r) => r.id);
    const rolesByUser: Record<string, any[]> = {};

    if (userIds.length > 0) {
      const userRolesResult = await this.database
        .select({
          userId: userRoles.userId,
          roleId: roles.id,
          code: roles.code,
          name: roles.name,
          description: roles.description,
          status: roles.status,
          createdAt: roles.createdAt,
          updatedAt: roles.updatedAt,
        })
        .from(userRoles)
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(inArray(userRoles.userId, userIds));

      userRolesResult.forEach((r) => {
        if (!rolesByUser[r.userId]) rolesByUser[r.userId] = [];
        if (r.roleId) {
          rolesByUser[r.userId].push({
            id: r.roleId,
            code: r.code,
            name: r.name,
            description: r.description,
            status: r.status,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          });
        }
      });
    }

    const enrichedResult = result.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      employeeId: u.employeeId,
      department: u.departmentId
        ? { id: u.departmentId, name: u.departmentName ?? null }
        : null,
      status: u.status,
      roles: rolesByUser[u.id] || [],
    }));

    return {
      data: enrichedResult,
      total: totalResult[0]?.count ?? 0,
      page,
      pageSize,
    };
  }

  async getRolesByUserId(userId: string) {
    const [foundUser] = await this.database
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const rows = await this.database
      .select({
        id: roles.id,
        code: roles.code,
        name: roles.name,
        description: roles.description,
        status: roles.status,
        createdAt: roles.createdAt,
        updatedAt: roles.updatedAt,
      })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return {
      userId,
      roles: rows.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        description: r.description,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
    };
  }

  async getAllActiveRoles() {
    return this.database
      .select({
        id: roles.id,
        code: roles.code,
        name: roles.name,
        description: roles.description,
        status: roles.status,
      })
      .from(roles)
      .where(eq(roles.status, 'active'))
      .orderBy(asc(roles.name));
  }

  async getUserEffectivePermissions(userId: string): Promise<Set<string>> {
    const rows = await this.database
      .select({ permissionCode: permissions.code })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(roles.status, 'active'),
          eq(permissions.status, 'active'),
        ),
      );

    return new Set(rows.map((r) => r.permissionCode));
  }

  async hasPermission(
    userId: string,
    permissionCode: string,
  ): Promise<boolean> {
    const userPermissions = await this.getUserEffectivePermissions(userId);
    return userPermissions.has(permissionCode);
  }

  async getRoleAssignmentOptions(userId: string) {
    const [foundUser] = await this.database
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const allRoles = await this.database
      .select({
        id: roles.id,
        code: roles.code,
        name: roles.name,
        description: roles.description,
        status: roles.status,
      })
      .from(roles)
      .orderBy(asc(roles.name));

    const assignedRoleIds = await this.database
      .select({ roleId: userRoles.roleId })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    const assignedSet = new Set(assignedRoleIds.map((r) => r.roleId));

    return allRoles.map((role) => ({
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description,
      status: role.status,
      assigned: assignedSet.has(role.id),
    }));
  }

  async assign(userId: string, roleId: string) {
    const [foundUser] = await this.database
      .select({ id: user.id, status: user.status })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.status !== 'active') {
      throw new ForbiddenException('Cannot assign roles to an inactive user');
    }

    const [foundRole] = await this.database
      .select({ id: roles.id, code: roles.code, status: roles.status })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!foundRole) {
      throw new NotFoundException('Role not found');
    }

    if (foundRole.status !== 'active') {
      throw new BadRequestException(
        `Role "${foundRole.code}" is inactive and cannot be assigned`,
      );
    }

    const existing = await this.database
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('User already has this role assigned');
    }

    await this.database.insert(userRoles).values({ userId, roleId });

    await this.recordAuditLog({
      actorUserId: userId,
      userId,
      action: 'ROLE_ASSIGNED',
      entityType: 'user_role',
      entityId: userId,
      metadata: { roleId, roleCode: foundRole.code },
    });

    return { success: true };
  }

  async assignMany(userId: string, roleIds: string[]) {
    const uniqueRoleIds = Array.from(new Set(roleIds));

    const [foundUser] = await this.database
      .select({ id: user.id, status: user.status })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.status !== 'active') {
      throw new ForbiddenException('Cannot assign roles to an inactive user');
    }

    const roleRows = await this.database
      .select({ id: roles.id, code: roles.code, status: roles.status })
      .from(roles)
      .where(inArray(roles.id, uniqueRoleIds));

    if (roleRows.length !== uniqueRoleIds.length) {
      const foundIds = new Set(roleRows.map((r) => r.id));
      const invalidIds = uniqueRoleIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Roles not found: ${invalidIds.join(', ')}`);
    }

    const inactiveRoles = roleRows.filter((r) => r.status !== 'active');
    if (inactiveRoles.length > 0) {
      throw new BadRequestException(
        `Inactive roles cannot be assigned: ${inactiveRoles.map((r) => r.code).join(', ')}`,
      );
    }

    const existingAssignments = await this.database
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          inArray(userRoles.roleId, uniqueRoleIds),
        ),
      );

    const existingSet = new Set(existingAssignments.map((a) => a.roleId));
    const toAssign = uniqueRoleIds.filter((id) => !existingSet.has(id));

    return await this.database.transaction(async (tx) => {
      if (toAssign.length > 0) {
        await tx
          .insert(userRoles)
          .values(toAssign.map((roleId) => ({ userId, roleId })));

        for (const assignedId of toAssign) {
          const role = roleRows.find((r) => r.id === assignedId)!;
          await this.recordAuditLogInTx(tx, {
            actorUserId: userId,
            userId,
            action: 'ROLE_ASSIGNED',
            entityType: 'user_role',
            entityId: userId,
            metadata: { roleId: assignedId, roleCode: role.code },
          });
        }
      }

      return { success: true, assigned: toAssign.length };
    });
  }

  async remove(userId: string, roleId: string) {
    const [foundUser] = await this.database
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const [foundRole] = await this.database
      .select({ id: roles.id, code: roles.code })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!foundRole) {
      throw new NotFoundException('Role not found');
    }

    const result = await this.database
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .returning();

    if (result.length > 0) {
      await this.recordAuditLog({
        actorUserId: userId,
        userId,
        action: 'ROLE_REMOVED',
        entityType: 'user_role',
        entityId: userId,
        metadata: { roleId, roleCode: foundRole.code },
      });
    }

    return { success: true, removed: result.length };
  }

  async replace(userId: string, roleIds: string[]) {
    const [foundUser] = await this.database
      .select({ id: user.id, status: user.status })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (foundUser.status !== 'active') {
      throw new ForbiddenException('Cannot assign roles to an inactive user');
    }

    if (roleIds.length > 0) {
      const uniqueRoleIds = Array.from(new Set(roleIds));
      const roleRows = await this.database
        .select({ id: roles.id, code: roles.code, status: roles.status })
        .from(roles)
        .where(inArray(roles.id, uniqueRoleIds));

      if (roleRows.length !== uniqueRoleIds.length) {
        const foundIds = new Set(roleRows.map((r) => r.id));
        const invalidIds = uniqueRoleIds.filter((id) => !foundIds.has(id));
        throw new NotFoundException(
          `Roles not found: ${invalidIds.join(', ')}`,
        );
      }

      const inactiveRoles = roleRows.filter((r) => r.status !== 'active');
      if (inactiveRoles.length > 0) {
        throw new BadRequestException(
          `Inactive roles cannot be assigned: ${inactiveRoles.map((r) => r.code).join(', ')}`,
        );
      }
    }

    return await this.database.transaction(async (tx) => {
      await tx.delete(userRoles).where(eq(userRoles.userId, userId));

      if (roleIds.length > 0) {
        const uniqueRoleIds = Array.from(new Set(roleIds));
        await tx
          .insert(userRoles)
          .values(uniqueRoleIds.map((roleId) => ({ userId, roleId })));
      }

      await this.recordAuditLogInTx(tx, {
        actorUserId: userId,
        userId,
        action: 'ROLES_REPLACED',
        entityType: 'user_role',
        entityId: userId,
        metadata: { roleIds, count: roleIds.length },
      });

      return {
        success: true,
        assigned: roleIds.length,
      };
    });
  }

  async recordAuditLog(entry: {
    actorUserId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.database.insert(userAuditLogs).values({
      id: crypto.randomUUID(),
      actorUserId: entry.actorUserId,
      userId: entry.userId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata ?? {},
      createdAt: new Date(),
    });
  }

  private async recordAuditLogInTx(
    tx: any,
    entry: {
      actorUserId: string;
      userId: string;
      action: string;
      entityType: string;
      entityId: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    await tx.insert(userAuditLogs).values({
      id: crypto.randomUUID(),
      actorUserId: entry.actorUserId,
      userId: entry.userId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata ?? {},
      createdAt: new Date(),
    });
  }
}
