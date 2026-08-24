import { pgEnum, timestamp, varchar, serial } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const positionStatusEnum = pgEnum('position_status', [
  'active',
  'inactive',
]);

export const position = pgTable('position', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull().unique(),
  status: positionStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
