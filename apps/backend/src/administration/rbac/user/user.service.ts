import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../../database/database.module';
import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm';
import { user, userRoles } from '../../../auth/schema';
import { roles } from '../role/schemas/schema';

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class UserRbacService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findUsers(input?: {
    search?: string;
    status?: string;
    roleId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.search) {
      conditions.push(
        or(
          ilike(user.name, `%${input.search}%`),
          ilike(user.email, `%${input.search}%`),
        ) as SQL,
      );
    }

    if (input?.status) {
      conditions.push(eq(user.status, input.status as 'active' | 'inactive'));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result, totalResult] = await Promise.all([
      this.database
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          employeeId: user.employeeId,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(where)
        .orderBy(asc(user.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ count: count() }).from(user).where(where),
    ]);

    // Get roles for each user
    const userIds = result.map((r) => r.id);
    let rolesByUser: Record<string, any[]> = {};

    if (userIds.length > 0) {
      const userRolesResult = await this.database
        .select({
          userId: userRoles.userId,
          roleId: roles.id,
          code: roles.code,
          name: roles.name,
          description: roles.description,
          status: roles.status,
        })
        .from(userRoles)
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(or(...userIds.map((id) => eq(userRoles.userId, id))));

      userRolesResult.forEach((r) => {
        if (!rolesByUser[r.userId]) rolesByUser[r.userId] = [];
        rolesByUser[r.userId].push({
          id: r.roleId,
          code: r.code,
          name: r.name,
          description: r.description,
          status: r.status,
        });
      });
    }

    const enrichedResult = result.map((u) => ({
      ...u,
      roles: rolesByUser[u.id] || [],
    }));

    return {
      data: enrichedResult,
      total: totalResult[0]?.count ?? 0,
      page,
      pageSize,
    };
  }

  async getUserRoles(userId: string) {
    const result = await this.database
      .select({
        id: roles.id,
        code: roles.code,
        name: roles.name,
        description: roles.description,
        status: roles.status,
      })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return result;
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const existing = await this.database
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('User already has this role');
    }

    await this.database.insert(userRoles).values({
      userId,
      roleId,
    });

    return { success: true };
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    await this.database
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));

    return { success: true };
  }
}
