import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { UserRbacService } from './user.service';
import { UserRbacRouter } from './user.router';

@Module({
  imports: [DatabaseModule],
  providers: [UserRbacService, UserRbacRouter],
  exports: [UserRbacService],
})
export class UserRbacModule {}