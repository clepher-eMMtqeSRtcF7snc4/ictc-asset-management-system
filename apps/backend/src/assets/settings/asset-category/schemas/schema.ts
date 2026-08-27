import {
  pgEnum,
  timestamp,
  varchar,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const assetCategoryStatusEnum = pgEnum('asset_category_status', [
  'active',
  'inactive',
]);

export const assetCategory = pgTable('asset_category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  status: assetCategoryStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
