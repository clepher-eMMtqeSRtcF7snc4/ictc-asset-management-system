import { SupplierService } from './supplier.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  supplierFiledSchema,
  supplierSchema,
  activeSupplierListOutputSchema,
  CreateSupplierInput,
  UpdateSupplierInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class SupplierRouter {
  constructor(private readonly supplierService: SupplierService) {}

  @Mutation({ input: supplierFiledSchema })
  async create(@Input() createSupplierInput: CreateSupplierInput) {
    return this.supplierService.create(createSupplierInput);
  }

  @Mutation({
    input: supplierSchema
      .partial()
      .refine((data) => Object.keys(data).length > 0, {
        message: 'Provide at least one field to update',
      }),
  })
  async update(@Input() updateSupplierInput: UpdateSupplierInput) {
    const id = updateSupplierInput.id;
    if (!id) {
      throw new Error('Supplier ID is required for update');
    }
    return this.supplierService.update({ ...updateSupplierInput, id });
  }

  @Mutation({ input: z.object({ id: z.number().int().positive() }) })
  async delete(@Input() input: { id: number }) {
    return this.supplierService.delete(input.id);
  }

  @Query({
    input: z.object({ id: z.number().int().positive() }),
    output: supplierSchema,
  })
  async getSupplierById(@Input() input: { id: number }) {
    return this.supplierService.findById(input.id);
  }

  @Query({
    input: z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum(['active', 'inactive']).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({}),
    output: z.object({
      items: z.array(supplierSchema),
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      pageSize: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
    }),
  })
  async getSuppliers(
    @Input()
    input: {
      search?: string;
      status?: 'active' | 'inactive';
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.supplierService.findAll(input);
  }

  @Query({ output: activeSupplierListOutputSchema })
  async getActiveSuppliers() {
    return this.supplierService.findActive();
  }
}
