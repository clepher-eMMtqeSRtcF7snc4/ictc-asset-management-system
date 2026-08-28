import { pgEnum } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const assetStatusStatusEnum = pgEnum('asset_status_status', [
  'active',
  'inactive',
]);

export const assetStatus = pgTable('asset_status', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  status: assetStatusStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: varchar('created_by', { length: 150 }),
  updatedBy: varchar('updated_by', { length: 150 }),
});
