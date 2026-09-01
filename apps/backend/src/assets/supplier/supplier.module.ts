import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { DatabaseModule } from '../../database/database.module';
import { SupplierRouter } from './supplier.router';

@Module({
  imports: [DatabaseModule],
  providers: [SupplierService, SupplierRouter],
})
export class SupplierModule {}
