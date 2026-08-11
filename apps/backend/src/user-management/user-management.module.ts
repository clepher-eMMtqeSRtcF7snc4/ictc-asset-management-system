import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserManagementRouter } from './user-management.router';
import { UserManagementService } from './user-management.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserManagementService, UserManagementRouter],
})
export class UserManagementModule {}
