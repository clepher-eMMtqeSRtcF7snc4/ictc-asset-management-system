import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacAuthorizationModule {}
