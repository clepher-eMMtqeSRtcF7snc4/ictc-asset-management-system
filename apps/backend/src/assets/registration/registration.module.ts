import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RegistrationService } from './registration.service';
import { RegistrationRouter } from './registration.router';

@Module({
  imports: [DatabaseModule],
  providers: [RegistrationService, RegistrationRouter],
  exports: [RegistrationService],
})
export class RegistrationModule {}
