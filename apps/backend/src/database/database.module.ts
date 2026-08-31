import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from './database-connection';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from '../auth/schema';
import * as roomSchema from '../administration/room/schemas/schema';
import * as roomTypeSchema from '../administration/room-type/schemas/schema';
import * as departmentSchema from '../administration/department/schemas/schema';
import * as positionSchema from '../administration/position/schemas/schema';
import * as designationSchema from '../administration/designation/schemas/schema';
import * as employeeSchema from '../administration/employee/schemas/schema';
import * as assetCategorySchema from '../assets/settings/asset-category/schemas/schema';
import * as assetTypeSchema from '../assets/settings/asset-type/schemas/schema';
import * as assetRegistrationSchema from '../assets/registration/schemas/schema';
import * as supplierSchema from '../assets/supplier/schemas/schema';

export const schema = {
  ...authSchema,
  ...roomSchema,
  ...roomTypeSchema,
  ...departmentSchema,
  ...positionSchema,
  ...designationSchema,
  ...employeeSchema,
  ...supplierSchema,
  ...assetCategorySchema,
  ...assetTypeSchema,
  ...assetRegistrationSchema,
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: schema,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
