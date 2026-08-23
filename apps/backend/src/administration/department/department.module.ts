import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DepartmentService } from './department.service';
import { DepartmentRouter } from './department.router';

@Module({
  imports: [DatabaseModule],
  providers: [DepartmentService, DepartmentRouter],
  exports: [DepartmentService],
})
export class DepartmentModule {}
