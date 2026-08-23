import {
  pgEnum,
  timestamp,
  varchar,
  integer,
  text,
  serial,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { roomType } from '../../room-type/schemas/schema';

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

export const roomFloorEnum = pgEnum('room_floor', [
  '1st floor',
  '2nd floor',
  '3rd floor',
  '4th floor',
]);
export const roomStatusEnum = pgEnum('room_status', ['active', 'inactive']);

export const room = pgTable('room', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  code: varchar('code', { length: 30 }),
  roomTypeId: integer('room_type_id')
    .notNull()
    .references(() => roomType.id, { onDelete: 'restrict' }),
  buildingId: integer('building_id')
    .notNull()
    .references(() => building.id, { onDelete: 'cascade' }),
  floor: roomFloorEnum('floor').notNull(),
  departmentId: integer('department_id'),
  status: roomStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
