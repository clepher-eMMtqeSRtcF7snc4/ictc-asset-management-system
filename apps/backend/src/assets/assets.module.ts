import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AssetsRouter } from './assets.router';
import { AssetsService } from './assets.service';

@Module({
  imports: [DatabaseModule],
  providers: [AssetsService, AssetsRouter],
})
export class AssetsModule {}
