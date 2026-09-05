import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { UserRbacService } from './user.service';
import { UserRbacRouter } from './user.router';
import { UserRoleService } from './user-role.service';
import { UserRoleRouter } from './user-role.router';

@Module({
  imports: [DatabaseModule],
  providers: [UserRbacService, UserRbacRouter, UserRoleService, UserRoleRouter],
  exports: [UserRbacService, UserRoleService],
})
export class UserRbacModule {}
