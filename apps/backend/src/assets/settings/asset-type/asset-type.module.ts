import { Module } from '@nestjs/common';
import { AssetTypeService } from './asset-type.service';

@Module({
  providers: [AssetTypeService]
})
export class AssetTypeModule {}
