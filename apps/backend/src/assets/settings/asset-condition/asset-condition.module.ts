import { Module } from '@nestjs/common';
import { AssetConditionService } from './asset-condition.service';
import { DatabaseModule } from '../../../database/database.module';
import { AssetConditionRouter } from './asset-condition.router';

@Module({
  imports: [DatabaseModule],
  providers: [AssetConditionService, AssetConditionRouter],
})
export class AssetConditionModule {}
