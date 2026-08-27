import { Module } from '@nestjs/common';
import { AssetCategoryService } from './asset-category.service';
import { DatabaseModule } from '../../../database/database.module';
import { AssetCategoryRouter } from './asset-category.router';

@Module({
  imports: [DatabaseModule],
  providers: [AssetCategoryService, AssetCategoryRouter],
})
export class AssetCategoryModule {}
