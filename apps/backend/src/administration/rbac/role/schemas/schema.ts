import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const roleStatus = pgEnum('role_status', ['active', 'inactive']);

export const roles = pgTable(
  'roles',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    status: roleStatus('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('roles_name_unique_idx').on(table.name),
    uniqueIndex('roles_code_unique_idx').on(table.code),
  ],
);
