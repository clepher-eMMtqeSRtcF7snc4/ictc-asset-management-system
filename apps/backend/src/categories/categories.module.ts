import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategoriesRouter } from './categories.router';
import { CategoriesService } from './categories.service';

@Module({
  imports: [DatabaseModule],
  providers: [CategoriesService, CategoriesRouter],
})
export class CategoriesModule {}
