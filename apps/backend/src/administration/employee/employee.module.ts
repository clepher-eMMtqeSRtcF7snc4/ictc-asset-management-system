import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeService } from './employee.service';
import { EmployeeRouter } from './employee.router';

@Module({
  imports: [DatabaseModule],
  providers: [EmployeeService, EmployeeRouter],
  exports: [EmployeeService],
})
export class EmployeeModule {}
