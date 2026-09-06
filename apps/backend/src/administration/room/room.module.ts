import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { DatabaseModule } from '../../database/database.module';
import { RoomRouter } from './room.router';
import { RbacAuthorizationModule } from '../rbac/authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [RoomService, RoomRouter],
})
export class RoomModule {}
