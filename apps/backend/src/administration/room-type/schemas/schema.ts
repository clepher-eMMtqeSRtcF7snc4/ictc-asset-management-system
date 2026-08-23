import { pgEnum, timestamp, varchar, serial } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const roomType = pgTable('room_type', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  code: varchar('code', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
