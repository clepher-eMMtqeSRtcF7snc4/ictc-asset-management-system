import { Module } from '@nestjs/common';
import { AssetCategoryService } from './asset-category.service';

@Module({
  providers: [AssetCategoryService]
})
export class AssetCategoryModule {}
