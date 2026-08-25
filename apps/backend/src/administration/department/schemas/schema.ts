import { pgEnum, timestamp, varchar, serial, text, integer } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { employee } from '../../employee/schemas/schema';

export const departmentStatusEnum = pgEnum('department_status', [
  'active',
  'inactive',
]);

export const department = pgTable('department', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  supervisorId: integer('supervisor_id').references(() => employee.id),
  custodianId: integer('custodian_id').references(() => employee.id),
  logo: text('logo'),
  color: varchar('color', { length: 20 }),
  status: departmentStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
