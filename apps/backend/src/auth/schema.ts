import { relations, sql } from 'drizzle-orm';
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  serial,
  integer,
  numeric,
  date,
} from 'drizzle-orm/pg-core';
import { primaryKey } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  bio: text('bio'),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const follow = pgTable(
  'follow',
  {
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id),
    followingId: text('following_id')
      .notNull()
      .references(() => user.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
  }),
);

export const departments = pgTable(
  'departments',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    type: text('type').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('departments_status_idx').on(table.status),
    index('departments_type_idx').on(table.type),
  ],
);

export const locations = pgTable(
  'locations',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    type: text('type').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('locations_status_idx').on(table.status),
    index('locations_type_idx').on(table.type),
  ],
);

export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    type: text('type').notNull(),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('categories_status_idx').on(table.status),
    index('categories_type_idx').on(table.type),
  ],
);

export const roles = pgTable(
  'roles',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    permissions: jsonb('permissions').$type<string[]>().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('roles_name_idx').on(table.name)],
);

export const userProfiles = pgTable(
  'user_profiles',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    position: text('position').notNull(),
    designation: text('designation').notNull(),
    office: text('office').notNull(),
    departmentId: integer('department_id').references(() => departments.id, {
      onDelete: 'set null',
    }),
    roleId: text('role_id').references(() => roles.id, {
      onDelete: 'set null',
    }),
    status: text('status')
      .$type<'active' | 'inactive' | 'suspended'>()
      .notNull()
      .default('active'),
    profilePicture: text('profile_picture'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('user_profiles_department_idx').on(table.departmentId),
    index('user_profiles_role_idx').on(table.roleId),
    index('user_profiles_status_idx').on(table.status),
  ],
);

export const userAuditLogs = pgTable(
  'user_audit_logs',
  {
    id: text('id').primaryKey(),
    actorUserId: text('actor_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('user_audit_logs_created_at_idx').on(table.createdAt),
    index('user_audit_logs_user_id_idx').on(table.userId),
    index('user_audit_logs_entity_idx').on(table.entityType, table.entityId),
  ],
);

export const assets = pgTable(
  'assets',
  {
    id: serial('id').primaryKey(),
    name: text('name'),
    assetType: text('asset_type'),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    departmentId: integer('department_id').references(() => departments.id, {
      onDelete: 'set null',
    }),
    locationId: integer('location_id').references(() => locations.id, {
      onDelete: 'set null',
    }),
    custodianId: text('custodian_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    brand: text('brand'),
    model: text('model'),
    description: text('description'),
    condition: text('condition'),
    serialNumber: text('serial_number').unique(),
    barcode: text('barcode'),
    partNumber: text('part_number'),
    acquisitionDate: date('acquisition_date'),
    purchaseDate: date('purchase_date'),
    acquisitionCost: numeric('acquisition_cost', {
      precision: 14,
      scale: 2,
      mode: 'number',
    }),
    supplier: text('supplier'),
    reference: text('reference'),
    fundingSource: text('funding_source'),
    warrantyStartDate: date('warranty_start_date'),
    warrantyEndDate: date('warranty_end_date'),
    usefulLife: integer('useful_life'),
    residualValue: numeric('residual_value', {
      precision: 14,
      scale: 2,
      mode: 'number',
    }),
    depreciationMethod: text('depreciation_method'),
    imageUrl: text('image_url'),
    assetTag: text('asset_tag').notNull().unique(),
    propertyNumber: text('property_number').notNull().unique(),
    qrValue: text('qr_value').notNull().unique(),
    status: text('status')
      .$type<'draft' | 'available' | 'assigned'>()
      .notNull()
      .default('available'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('assets_category_idx').on(table.categoryId),
    index('assets_department_idx').on(table.departmentId),
    index('assets_location_idx').on(table.locationId),
    index('assets_custodian_idx').on(table.custodianId),
    index('assets_status_idx').on(table.status),
  ],
);

export const assetHistory = pgTable(
  'asset_history',
  {
    id: serial('id').primaryKey(),
    assetId: integer('asset_id')
      .notNull()
      .references(() => assets.id, { onDelete: 'cascade' }),
    actorUserId: text('actor_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    action: text('action').notNull(),
    snapshot: jsonb('snapshot')
      .$type<Record<string, unknown>>()
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('asset_history_asset_created_idx').on(table.assetId, table.createdAt),
    index('asset_history_actor_idx').on(table.actorUserId),
  ],
);

export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.id],
  }),
  following: one(user, {
    fields: [follow.followingId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  posts: many(user),
  profile: one(userProfiles),
  auditLogsAsActor: many(userAuditLogs, {
    relationName: 'audit_actor',
  }),
  auditLogsAsSubject: many(userAuditLogs, {
    relationName: 'audit_subject',
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const roleRelations = relations(roles, ({ many }) => ({
  userProfiles: many(userProfiles),
}));

export const userProfileRelations = relations(userProfiles, ({ one }) => ({
  user: one(user, {
    fields: [userProfiles.userId],
    references: [user.id],
  }),
  department: one(departments, {
    fields: [userProfiles.departmentId],
    references: [departments.id],
  }),
  role: one(roles, {
    fields: [userProfiles.roleId],
    references: [roles.id],
  }),
}));

export const userAuditLogRelations = relations(userAuditLogs, ({ one }) => ({
  actor: one(user, {
    fields: [userAuditLogs.actorUserId],
    references: [user.id],
    relationName: 'audit_actor',
  }),
  user: one(user, {
    fields: [userAuditLogs.userId],
    references: [user.id],
    relationName: 'audit_subject',
  }),
}));

// export const userRelations = relations(user, ({ many }) => ({
//   posts: many(user),
// }));
