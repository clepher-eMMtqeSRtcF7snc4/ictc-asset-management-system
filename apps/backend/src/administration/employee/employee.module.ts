import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeService } from './employee.service';
import { EmployeeRouter } from './employee.router';
import { RbacAuthorizationModule } from '../rbac/authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [EmployeeService, EmployeeRouter],
  exports: [EmployeeService],
})
export class EmployeeModule {}
