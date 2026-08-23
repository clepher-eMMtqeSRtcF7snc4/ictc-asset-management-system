import { pgEnum, timestamp, varchar, serial, text, integer } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { department } from '../../department/schemas/schema';

export const employeeStatusEnum = pgEnum('employee_status', ['active', 'inactive', 'retire']);

export const employee = pgTable('employee', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  position: varchar('position', { length: 150 }).notNull(),
  designation: varchar('designation', { length: 150 }).notNull(),
  departmentId: integer('department_id').references(() => department.id),
  role: varchar('role', { length: 50 }),
  status: employeeStatusEnum('status').notNull().default('active'),
  photo: text('photo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
