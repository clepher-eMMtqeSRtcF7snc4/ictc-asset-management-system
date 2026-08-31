import { Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { SupplierService } from './supplier.service';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class SupplierRouter {
  constructor(private readonly supplierService: SupplierService) {}
}
