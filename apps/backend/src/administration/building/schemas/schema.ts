import { pgEnum, timestamp, varchar } from 'drizzle-orm/pg-core';
import { serial, text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const buildingStatusEnum = pgEnum('building_status', [
  'active',
  'inactive',
]);

export const building = pgTable('building', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull().unique(),
  code: varchar('code', { length: 30 }).notNull().unique(),
  status: buildingStatusEnum('status').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
