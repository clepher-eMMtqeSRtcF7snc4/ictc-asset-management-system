import {
  pgEnum,
  timestamp,
  varchar,
  serial,
  integer,
  text,
  numeric,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { assetCategory } from '../../settings/asset-category/schemas/schema';
import { assetType } from '../../settings/asset-type/schemas/schema';
import { assetCondition } from '../../settings/asset-condition/schemas/schema';
import { department } from '../../../administration/department/schemas/schema';
import { employee } from '../../../administration/employee/schemas/schema';
import { building } from '../../../administration/building/schemas/schema';
import { room } from '../../../administration/room/schemas/schema';
import { user } from '../../../auth/schema';
import { supplier } from '../../supplier/schemas/schema';

export const assetStatusEnum = pgEnum('asset_status_enum', [
  'active',
  'inactive',
]);

export const asset = pgTable('asset', {
  id: serial('id').primaryKey(),
  assetName: varchar('asset_name', { length: 150 }).notNull(),
  brand: varchar('brand', { length: 150 }).notNull(),
  model: varchar('model', { length: 150 }).notNull(),
  serialNumber: varchar('serial_number', { length: 150 }).notNull().unique(),
  propertyNumber: varchar('property_number', { length: 150 })
    .notNull()
    .unique(),
  qrCode: varchar('qr_code', { length: 255 }).notNull().unique(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  assetPhoto: text('asset_photo'),
  categoryId: integer('category_id')
    .references(() => assetCategory.id)
    .notNull(),
  assetTypeId: integer('asset_type_id')
    .references(() => assetType.id)
    .notNull(),
  conditionId: integer('condition_id')
    .references(() => assetCondition.id)
    .notNull(),
  acquisitionDate: timestamp('acquisition_date').notNull(),
  acquisitionCost: numeric('acquisition_cost', {
    precision: 12,
    scale: 2,
  }).notNull(),
  supplierId: integer('supplier_id').references(() => supplier.id),
  purchaseOrderNumber: varchar('purchase_order_number', { length: 150 }),
  warranty: varchar('warranty', { length: 255 }),
  supportingDocs: text('supporting_docs'),
  departmentId: integer('department_id')
    .references(() => department.id)
    .notNull(),
  custodianId: integer('custodian_id')
    .references(() => employee.id)
    .notNull(),
  buildingId: integer('building_id').references(() => building.id),
  roomId: integer('room_id').references(() => room.id),
  status: assetStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdBy: text('created_by')
    .references(() => user.id)
    .notNull(),
  updatedBy: text('updated_by').references(() => user.id),
});
