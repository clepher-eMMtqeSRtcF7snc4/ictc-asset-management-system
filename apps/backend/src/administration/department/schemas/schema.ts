import { pgEnum, timestamp, varchar, serial, text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const departmentStatusEnum = pgEnum('department_status', [
  'active',
  'inactive',
]);

export const department = pgTable('department', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  shortName: varchar('short_name', { length: 50 }),
  description: text('description'),
  supervisor: varchar('supervisor', { length: 150 }),
  custodian: varchar('custodian', { length: 150 }),
  logo: text('logo'),
  color: varchar('color', { length: 20 }),
  status: departmentStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
