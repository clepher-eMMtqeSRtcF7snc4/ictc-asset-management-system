import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthAuthorizationRouter } from './auth-authorization.router';
import { RbacAuthorizationModule } from '../administration/rbac/authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [AuthAuthorizationRouter],
  exports: [],
})
export class AuthAuthorizationModule {}
