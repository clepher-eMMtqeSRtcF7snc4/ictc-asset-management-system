import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { DATABASE_CONNECTION } from './database/database-connection';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { TRPCModule } from 'nestjs-trpc-v2';
import { UsersModule } from './auth/users/users.module';
import { UploadModule } from './upload/upload.module';
import { AppContext } from './app.context';
import { AuthTrpcMiddleware } from './auth/auth-trpc.middleware';
import { CategoriesModule } from './master-data/categories/categories.module';
import { DepartmentsModule } from './master-data/departments/departments.module';
import { LocationsModule } from './master-data/locations/locations.module';
import { UserManagementModule } from './user-management/user-management.module';
import { AssetsModule } from './assets/assets.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
      context: AppContext,
      basePath: '/api/trpc',
    }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: [configService.getOrThrow('UI_URL')],
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
    UsersModule,
    DepartmentsModule,
    LocationsModule,
    CategoriesModule,
    UserManagementModule,
    AssetsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AuthTrpcMiddleware,
    AppContext,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
