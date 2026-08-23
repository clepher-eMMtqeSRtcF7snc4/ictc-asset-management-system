import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { DatabaseModule } from '../../database/database.module';
import { RoomRouter } from './room.router';

@Module({
  imports: [DatabaseModule],
  providers: [RoomService, RoomRouter],
})
export class RoomModule {}
