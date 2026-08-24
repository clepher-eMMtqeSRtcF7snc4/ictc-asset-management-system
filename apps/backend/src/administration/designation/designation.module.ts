import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DesignationService } from './designation.service';
import { DesignationRouter } from './designation.router';

@Module({
  imports: [DatabaseModule],
  providers: [DesignationService, DesignationRouter],
})
export class DesignationModule {}
