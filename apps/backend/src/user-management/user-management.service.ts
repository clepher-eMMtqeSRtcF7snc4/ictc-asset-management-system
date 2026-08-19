import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  ne,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { alias } from 'drizzle-orm/pg-core';
import { randomUUID } from 'node:crypto';
import {
  type AuditLogListInput,
  type CreateRoleInput,
  type CreateUserInput,
  type SetUserStatusInput,
  type UpdateRoleInput,
  type UpdateUserInput,
  type UserManagementListInput,
} from '@repo/trpc/schemas';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { schema } from '../database/database.module';
import {
  roles,
  user,
  userAuditLogs,
  userProfiles,
} from '../auth/schema';

const auditActor = alias(user, 'audit_actor');
const auditSubject = alias(user, 'audit_subject');

@Injectable()
export class UserManagementService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async listUsers(input: UserManagementListInput) {
    return this.database
      .select(this.userSelect())
      .from(userProfiles)
      .innerJoin(user, eq(userProfiles.userId, user.id))
      .leftJoin(roles, eq(userProfiles.roleId, roles.id))
      .where(this.userListConditions(input))
      .orderBy(asc(userProfiles.lastName), asc(userProfiles.firstName));
  }

  async getUserSummary() {
    const [userCounts, roleCounts] = await Promise.all([
      this.database
        .select({
          totalUsers: count(),
          activeUsers: sql<number>`count(*) filter (where ${userProfiles.status} = 'active')`,
          inactiveUsers: sql<number>`count(*) filter (where ${userProfiles.status} = 'inactive')`,
          suspendedUsers: sql<number>`count(*) filter (where ${userProfiles.status} = 'suspended')`,
        })
        .from(userProfiles),
      this.database.select({ totalRoles: count() }).from(roles),
    ]);

    return {
      totalUsers: Number(userCounts[0]?.totalUsers ?? 0),
      activeUsers: Number(userCounts[0]?.activeUsers ?? 0),
      inactiveUsers: Number(userCounts[0]?.inactiveUsers ?? 0),
      suspendedUsers: Number(userCounts[0]?.suspendedUsers ?? 0),
      totalRoles: Number(roleCounts[0]?.totalRoles ?? 0),
    };
  }

  async createUser(input: CreateUserInput, actorUserId: string) {
    const id = await this.database.transaction(async (tx) => {
      await this.requireRole(input.roleId, tx);

      const existingByEmail = await tx
        .select({ id: user.id })
        .from(user)
        .where(ilike(user.email, input.email))
        .limit(1);

      if (existingByEmail[0] && existingByEmail[0].id !== input.userId) {
        throw new ConflictException('A user with this email already exists');
      }

      const userId = input.userId ?? randomUUID();
      if (input.userId) {
        const existingUser = await tx
          .select({ id: user.id })
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);
        this.requireRecord(existingUser[0], 'Authentication user');

        const existingProfile = await tx
          .select({ userId: userProfiles.userId })
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId))
          .limit(1);
        if (existingProfile[0]) {
          throw new ConflictException('This authentication user already has a profile');
        }

        await tx
          .update(user)
          .set({
            name: this.fullName(input),
            email: input.email,
            image: input.profilePicture ?? null,
          })
          .where(eq(user.id, userId));
      } else {
        await tx.insert(user).values({
          id: userId,
          name: this.fullName(input),
          email: input.email,
          image: input.profilePicture ?? null,
        });
      }

      await tx.insert(userProfiles).values({
        userId,
        firstName: input.firstName,
        middleName: input.middleName ?? null,
        lastName: input.lastName,
        position: input.position,
        designation: input.designation,
        office: input.office,
        roleId: input.roleId,
        status: input.status,
        profilePicture: input.profilePicture ?? null,
      });
      await this.writeAuditLog(tx, {
        actorUserId,
        userId,
        action: 'user.created',
        entityType: 'user',
        entityId: userId,
        metadata: { status: input.status, roleId: input.roleId },
      });

      return userId;
    });

    return this.getUserById(id);
  }

  async updateUser(input: UpdateUserInput, actorUserId: string) {
    const { id, email, profilePicture, ...profileUpdates } = input;

    await this.database.transaction(async (tx) => {
      this.requireRecord(
        (
          await tx
            .select({ userId: userProfiles.userId })
            .from(userProfiles)
            .where(eq(userProfiles.userId, id))
            .limit(1)
        )[0],
        'User profile',
      );

      if (profileUpdates.roleId !== undefined) {
        await this.requireRole(profileUpdates.roleId, tx);
      }
      if (email !== undefined) {
        await this.assertEmailAvailable(email, id, tx);
        await tx.update(user).set({ email }).where(eq(user.id, id));
      }
      if (profilePicture !== undefined) {
        await tx.update(user).set({ image: profilePicture }).where(eq(user.id, id));
      }

      const hasProfileUpdates =
        Object.keys(profileUpdates).length > 0 || profilePicture !== undefined;
      if (hasProfileUpdates) {
        await tx
          .update(userProfiles)
          .set({ ...profileUpdates, profilePicture })
          .where(eq(userProfiles.userId, id));
      }

      const profile = await tx
        .select({
          firstName: userProfiles.firstName,
          middleName: userProfiles.middleName,
          lastName: userProfiles.lastName,
        })
        .from(userProfiles)
        .where(eq(userProfiles.userId, id))
        .limit(1);
      await tx
        .update(user)
        .set({
          name: this.fullName(profile[0]),
        })
        .where(eq(user.id, id));
      await this.writeAuditLog(tx, {
        actorUserId,
        userId: id,
        action: 'user.updated',
        entityType: 'user',
        entityId: id,
        metadata: { fields: Object.keys(input).filter((key) => key !== 'id') },
      });
    });

    return this.getUserById(id);
  }

  async setUserStatus(input: SetUserStatusInput, actorUserId: string) {
    await this.database.transaction(async (tx) => {
      const [updated] = await tx
        .update(userProfiles)
        .set({ status: input.status })
        .where(eq(userProfiles.userId, input.id))
        .returning({ userId: userProfiles.userId });
      this.requireRecord(updated, 'User profile');
      await this.writeAuditLog(tx, {
        actorUserId,
        userId: input.id,
        action: 'user.status_changed',
        entityType: 'user',
        entityId: input.id,
        metadata: { status: input.status },
      });
    });

    return this.getUserById(input.id);
  }

  async listRoles() {
    return this.database.select().from(roles).orderBy(asc(roles.name));
  }

  async createRole(input: CreateRoleInput, actorUserId: string) {
    const id = randomUUID();
    const [created] = await this.database.transaction(async (tx) => {
      await this.assertRoleNameAvailable(input.name, undefined, tx);
      const createdRole = await tx.insert(roles).values({ id, ...input }).returning();
      await this.writeAuditLog(tx, {
        actorUserId,
        action: 'role.created',
        entityType: 'role',
        entityId: id,
        metadata: { name: input.name, permissions: input.permissions },
      });
      return createdRole;
    });
    return this.requireRecord(created, 'Role');
  }

  async updateRole(input: UpdateRoleInput, actorUserId: string) {
    const { id, ...updates } = input;
    const [updated] = await this.database.transaction(async (tx) => {
      if (updates.name !== undefined) {
        await this.assertRoleNameAvailable(updates.name, id, tx);
      }
      const updatedRole = await tx
        .update(roles)
        .set(updates)
        .where(eq(roles.id, id))
        .returning();
      this.requireRecord(updatedRole[0], 'Role');
      await this.writeAuditLog(tx, {
        actorUserId,
        action: 'role.updated',
        entityType: 'role',
        entityId: id,
        metadata: { fields: Object.keys(updates) },
      });
      return updatedRole;
    });
    return this.requireRecord(updated, 'Role');
  }

  async listAuditLogs(input: AuditLogListInput) {
    const conditions: SQL[] = [];
    if (input.userId) {
      conditions.push(eq(userAuditLogs.userId, input.userId));
    }
    if (input.action) {
      conditions.push(eq(userAuditLogs.action, input.action));
    }

    return this.database
      .select({
        id: userAuditLogs.id,
        actorUserId: userAuditLogs.actorUserId,
        actorName: auditActor.name,
        userId: userAuditLogs.userId,
        userName: auditSubject.name,
        action: userAuditLogs.action,
        entityType: userAuditLogs.entityType,
        entityId: userAuditLogs.entityId,
        metadata: userAuditLogs.metadata,
        createdAt: userAuditLogs.createdAt,
      })
      .from(userAuditLogs)
      .leftJoin(auditActor, eq(auditActor.id, userAuditLogs.actorUserId))
      .leftJoin(auditSubject, eq(auditSubject.id, userAuditLogs.userId))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(userAuditLogs.createdAt))
      .limit(input.limit);
  }

  private async getUserById(id: string) {
    const [result] = await this.database
      .select(this.userSelect())
      .from(userProfiles)
      .innerJoin(user, eq(userProfiles.userId, user.id))
      .leftJoin(roles, eq(userProfiles.roleId, roles.id))
      .where(eq(userProfiles.userId, id))
      .limit(1);
    return this.requireRecord(result, 'User profile');
  }

  private userSelect() {
    return {
      id: user.id,
      firstName: userProfiles.firstName,
      middleName: userProfiles.middleName,
      lastName: userProfiles.lastName,
      email: user.email,
      position: userProfiles.position,
      designation: userProfiles.designation,
      office: userProfiles.office,
      roleId: userProfiles.roleId,
      roleName: roles.name,
      status: userProfiles.status,
      profilePicture: userProfiles.profilePicture,
      createdAt: userProfiles.createdAt,
      updatedAt: userProfiles.updatedAt,
    };
  }

  private userListConditions(input: UserManagementListInput): SQL | undefined {
    const conditions: SQL[] = [];
    if (input.search) {
      conditions.push(
        or(
          ilike(userProfiles.firstName, `%${input.search}%`),
          ilike(userProfiles.lastName, `%${input.search}%`),
          ilike(user.email, `%${input.search}%`),
        )!,
      );
    }
    if (input.status) {
      conditions.push(eq(userProfiles.status, input.status));
    }
    return conditions.length ? and(...conditions) : undefined;
  }

  private async requireRole(id: string, database: NodePgDatabase<typeof schema>) {
    const [role] = await database
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);
    return this.requireRecord(role, 'Role');
  }

  private async assertEmailAvailable(
    email: string,
    currentUserId: string | undefined,
    database: NodePgDatabase<typeof schema>,
  ) {
    const conditions: SQL[] = [ilike(user.email, email)];
    if (currentUserId) {
      conditions.push(ne(user.id, currentUserId));
    }
    const [existing] = await database
      .select({ id: user.id })
      .from(user)
      .where(and(...conditions))
      .limit(1);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }
  }

  private async assertRoleNameAvailable(
    name: string,
    currentRoleId: string | undefined,
    database: NodePgDatabase<typeof schema>,
  ) {
    const conditions: SQL[] = [ilike(roles.name, name)];
    if (currentRoleId) {
      conditions.push(ne(roles.id, currentRoleId));
    }
    const [existing] = await database
      .select({ id: roles.id })
      .from(roles)
      .where(and(...conditions))
      .limit(1);
    if (existing) {
      throw new ConflictException('A role with this name already exists');
    }
  }

  private async writeAuditLog(
    database: NodePgDatabase<typeof schema>,
    log: {
      actorUserId: string;
      userId?: string;
      action: string;
      entityType: string;
      entityId: string;
      metadata: Record<string, unknown>;
    },
  ) {
    await database.insert(userAuditLogs).values({
      id: randomUUID(),
      actorUserId: log.actorUserId,
      userId: log.userId ?? null,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      metadata: log.metadata,
    });
  }

  private fullName(input: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
  }) {
    return [input.firstName, input.middleName, input.lastName]
      .filter(Boolean)
      .join(' ');
  }

  private requireRecord<T>(record: T | undefined, label: string): T {
    if (!record) {
      throw new NotFoundException(`${label} not found`);
    }
    return record;
  }
}
