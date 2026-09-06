import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DepartmentService } from './department.service';
import { DepartmentRouter } from './department.router';
import { RbacAuthorizationModule } from '../rbac/authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [DepartmentService, DepartmentRouter],
  exports: [DepartmentService],
})
export class DepartmentModule {}
