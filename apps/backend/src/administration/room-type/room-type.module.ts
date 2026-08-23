import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { DatabaseModule } from '../../database/database.module';
import { RoomTypeRouter } from './room-type.router';

@Module({
  imports: [DatabaseModule],
  providers: [RoomTypeService, RoomTypeRouter],
})
export class RoomTypeModule {}
