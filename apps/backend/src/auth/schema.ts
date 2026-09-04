import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { employee } from '../administration/employee/schemas/schema';
import { roles, roleStatus } from '../administration/rbac/role/schemas/schema';
import {
  permissions,
  permissionStatus,
} from '../administration/rbac/permission/schemas/schema';

export const userStatus = pgEnum('user_status', ['active', 'inactive']);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  employeeId: integer('employee_id')
    .unique()
    .references(() => employee.id, {
      onDelete: 'set null',
    }),
  status: userStatus('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const userRoles = pgTable(
  'user_roles',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [
    index('user_roles_userId_idx').on(table.userId),
    index('user_roles_roleId_idx').on(table.roleId),
    primaryKey({ columns: [table.userId, table.roleId] }),
  ],
);

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id, {
        onDelete: 'cascade',
      }),
    permissionId: text('permission_id')
      .notNull()
      .references(() => permissions.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [
    index('role_permissions_roleId_idx').on(table.roleId),
    index('role_permissions_permissionId_idx').on(table.permissionId),
    primaryKey({ columns: [table.roleId, table.permissionId] }),
  ],
);

export const userAuditLogs = pgTable(
  'user_audit_logs',
  {
    id: text('id').primaryKey(),
    actorUserId: text('actor_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('user_audit_logs_created_at_idx').on(table.createdAt),
    index('user_audit_logs_user_id_idx').on(table.userId),
    index('user_audit_logs_entity_idx').on(table.entityType, table.entityId),
  ],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  employee: one(employee, {
    fields: [user.employeeId],
    references: [employee.id],
  }),
  userRoles: many(userRoles),
  auditLogsAsActor: many(userAuditLogs, {
    relationName: 'audit_actor',
  }),
  auditLogsAsSubject: many(userAuditLogs, {
    relationName: 'audit_subject',
  }),
}));

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(user, {
    fields: [userRoles.userId],
    references: [user.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const rolePermissionRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userAuditLogRelations = relations(userAuditLogs, ({ one }) => ({
  actor: one(user, {
    fields: [userAuditLogs.actorUserId],
    references: [user.id],
    relationName: 'audit_actor',
  }),
}));
