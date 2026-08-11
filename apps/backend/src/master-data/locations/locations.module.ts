import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LocationsRouter } from './locations.router';
import { LocationsService } from './locations.service';

@Module({
  imports: [DatabaseModule],
  providers: [LocationsService, LocationsRouter],
})
export class LocationsModule {}
