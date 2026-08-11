import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DepartmentsRouter } from './departments.router';
import { DepartmentsService } from './departments.service';

@Module({
  imports: [DatabaseModule],
  providers: [DepartmentsService, DepartmentsRouter],
})
export class DepartmentsModule {}
