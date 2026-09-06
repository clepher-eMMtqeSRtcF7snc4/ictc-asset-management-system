import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { PermissionService } from './permission.service';
import { PermissionRouter } from './permission.router';
import { RbacAuthorizationModule } from '../authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [PermissionService, PermissionRouter],
  exports: [PermissionService],
})
export class PermissionModule {}
