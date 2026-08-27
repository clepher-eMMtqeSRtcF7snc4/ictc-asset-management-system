import { Module } from '@nestjs/common';
import { AssetTypeService } from './asset-type.service';
import { AssetTypeRouter } from './asset-type.router';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AssetTypeService, AssetTypeRouter],
})
export class AssetTypeModule {}
