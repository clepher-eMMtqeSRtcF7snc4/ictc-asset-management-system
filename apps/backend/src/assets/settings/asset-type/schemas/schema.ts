import {
  pgEnum,
  timestamp,
  varchar,
  serial,
  integer,
  boolean,
  text,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { assetCategory } from '../../asset-category/schemas/schema';

export const assetTypeStatusEnum = pgEnum('asset_type_status', [
  'active',
  'inactive',
]);

export const assetType = pgTable('asset_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  assetCategoryId: integer('asset_category_id').references(
    () => assetCategory.id,
  ),
  description: text('description'),
  depreciable: boolean('depreciable').notNull(),
  defaultUsefulLife: integer('default_useful_life'),
  status: assetTypeStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: varchar('created_by', { length: 255 }),
  updatedBy: varchar('updated_by', { length: 255 }),
});
