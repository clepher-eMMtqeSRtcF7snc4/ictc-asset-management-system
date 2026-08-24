import { Module } from '@nestjs/common';
import { PositionRouter } from './position.router';
import { DatabaseModule } from '../../database/database.module';
import { PositionService } from './position.service';

@Module({
  imports: [DatabaseModule],
  providers: [PositionService, PositionRouter],
})
export class PositionModule {}
