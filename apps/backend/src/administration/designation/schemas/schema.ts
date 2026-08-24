import { pgEnum, timestamp, varchar, serial } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const designationStatusEnum = pgEnum('designation_status', [
  'active',
  'inactive',
]);

export const designation = pgTable('designation', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull().unique(),
  status: designationStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
