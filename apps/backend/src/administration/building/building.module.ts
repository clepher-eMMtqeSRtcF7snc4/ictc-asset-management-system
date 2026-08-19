import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { DatabaseModule } from '../../database/database.module';
import { BuildingRouter } from './building.router';

@Module({
  imports: [DatabaseModule],
  providers: [BuildingService, BuildingRouter],
})
export class BuildingModule {}
