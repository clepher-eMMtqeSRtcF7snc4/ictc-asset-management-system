import { varchar } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { serial } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { user } from '../../../auth/schema';

export const supplierStatusEnum = pgEnum('supplier_status', [
  'active',
  'inactive',
]);

export const supplier = pgTable('supplier', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  businessRegistrationNo: text('business_registration_no'),
  philGEPsNo: text('phil_geps_no'),
  tin: text('tin'),
  vat: boolean('vat').notNull().default(false),
  description: text('description'),
  status: supplierStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: text('created_by').references(() => user.id),
  updatedBy: text('updated_by').references(() => user.id),
});
