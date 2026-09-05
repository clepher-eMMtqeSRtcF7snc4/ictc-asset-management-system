import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../../database/database.module';
import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm';
import { user, userRoles } from '../../../auth/schema';
import { roles } from '../role/schemas/schema';
import { employee } from '../../employee/schemas/schema';
import { department } from '../../department/schemas/schema';
import { AuthService } from '@thallesp/nestjs-better-auth';

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
    private readonly authService: AuthService,
  ) {}

  async isAdmin(userId: string): Promise<boolean> {
    const userRoleRows = await this.database
      .select({ code: roles.code })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return userRoleRows.some((row) => row.code === 'admin');
  }

  async getCurrentUser(userId: string) {
    const [foundUser] = await this.database
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const userRoleRows = await this.database
      .select({ code: roles.code })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      employeeId: foundUser.employeeId,
      status: foundUser.status,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
      roles: userRoleRows.map((row) => row.code),
      isAdmin: userRoleRows.some((row) => row.code === 'admin'),
    };
  }

  async createUser(
    currentUserId: string,
    data: {
      name: string;
      email: string;
      password: string;
      employeeId?: string;
    },
  ) {
    const admin = await this.isAdmin(currentUserId);
    if (!admin) {
      throw new ForbiddenException(
        'Only administrators can create user accounts.',
      );
    }

    const existing = await this.database
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, data.email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('A user with this email already exists.');
    }

    const result = await this.authService.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    const employeeId = data.employeeId ? Number(data.employeeId) : undefined;

    if (employeeId) {
      await this.database
        .update(user)
        .set({ employeeId })
        .where(eq(user.id, result.user.id));
    }

    return {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      emailVerified: result.user.emailVerified,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt,
    };
  }

  async findUsers(input?: {
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
          ilike(user.name, `%${input.search}%`),
          ilike(user.email, `%${input.search}%`),
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

    // Get roles for each user
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
      department: u.departmentId
        ? { id: u.departmentId, name: u.departmentName }
        : null,
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
