import {
  pgEnum,
  timestamp,
  varchar,
  serial,
  integer,
  text,
} from 'drizzle-orm/pg-core';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { department } from '../../department/schemas/schema';
import { position } from '../../position/schemas/schema';
import { designation } from '../../designation/schemas/schema';

export const employeeStatusEnum = pgEnum('employee_status', [
  'active',
  'inactive',
  'retire',
]);

export const employee = pgTable('employee', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  positionId: integer('position_id').references(() => position.id),
  designationId: integer('designation_id').references(() => designation.id),
  departmentId: integer('department_id').references(() => department.id),
  role: varchar('role', { length: 50 }),
  status: employeeStatusEnum('status').notNull().default('active'),
  photo: text('photo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
