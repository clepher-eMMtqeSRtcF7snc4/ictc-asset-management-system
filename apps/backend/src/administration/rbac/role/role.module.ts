import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { RoleService } from './role.service';
import { RoleRouter } from './role.router';
import { RbacAuthorizationModule } from '../authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [RoleService, RoleRouter],
  exports: [RoleService],
})
export class RoleModule {}
