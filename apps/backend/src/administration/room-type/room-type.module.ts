import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { DatabaseModule } from '../../database/database.module';
import { RoomTypeRouter } from './room-type.router';
import { RbacAuthorizationModule } from '../rbac/authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [RoomTypeService, RoomTypeRouter],
})
export class RoomTypeModule {}
