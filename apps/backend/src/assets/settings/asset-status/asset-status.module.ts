import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { AssetStatusService } from './asset-status.service';
import { AssetStatusRouter } from './asset-status.router';

@Module({
  imports: [DatabaseModule],
  providers: [AssetStatusService, AssetStatusRouter],
})
export class AssetStatusModule {}
