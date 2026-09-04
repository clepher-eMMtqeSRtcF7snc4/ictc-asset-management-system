import { relations } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { roles } from '../../role/schemas/schema';

export const permissionStatus = pgEnum('permission_status', [
  'active',
  'inactive',
]);

export const permissions = pgTable(
  'permissions',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    module: text('module').notNull(),
    action: text('action').notNull(),
    status: permissionStatus('status').notNull().default('active'),
  },
  (table) => [
    index('permissions_module_idx').on(table.module),
    index('permissions_action_idx').on(table.action),
    uniqueIndex('permissions_module_action_idx').on(table.module, table.action),
    uniqueIndex('permissions_code_unique_idx').on(table.code),
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
    primaryKey({
      columns: [table.roleId, table.permissionId],
    }),
  ],
);

export const permissionRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
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
