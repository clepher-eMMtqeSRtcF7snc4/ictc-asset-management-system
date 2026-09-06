import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { DatabaseModule } from '../../database/database.module';
import { BuildingRouter } from './building.router';
import { RbacAuthorizationModule } from '../rbac/authorization/rbac-authorization.module';

@Module({
  imports: [DatabaseModule, RbacAuthorizationModule],
  providers: [BuildingService, BuildingRouter],
})
export class BuildingModule {}
