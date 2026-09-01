import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../database/database.module';
import { supplier } from './schemas/schema';
import { and, asc, count, eq, ilike, ne, type SQL } from 'drizzle-orm';

@Injectable()
export class SupplierService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(input: {
    name: string;
    code: string;
    businessRegistrationNo?: string | null;
    philGEPsNo?: string | null;
    TIN?: string | null;
    VAT: boolean;
    description?: string | null;
    status: 'active' | 'inactive';
  }) {
    const [existingByName] = await this.database
      .select({ id: supplier.id })
      .from(supplier)
      .where(eq(supplier.name, input.name))
      .limit(1);

    if (existingByName) {
      throw new ConflictException('Supplier with this name already exists');
    }

    const [existingByCode] = await this.database
      .select({ id: supplier.id })
      .from(supplier)
      .where(eq(supplier.code, input.code))
      .limit(1);

    if (existingByCode) {
      throw new ConflictException('Supplier with this code already exists');
    }

    const [result] = await this.database
      .insert(supplier)
      .values({
        name: input.name,
        code: input.code,
        businessRegistrationNo: input.businessRegistrationNo ?? null,
        philGEPsNo: input.philGEPsNo ?? null,
        tin: input.TIN ?? null,
        vat: input.VAT,
        description: input.description ?? null,
        status: input.status,
      })
      .returning();

    return result;
  }

  async update(input: {
    id: number;
    name?: string;
    code?: string;
    businessRegistrationNo?: string | null;
    philGEPsNo?: string | null;
    TIN?: string | null;
    VAT?: boolean;
    description?: string | null;
    status?: 'active' | 'inactive';
  }) {
    if (input.name) {
      const [duplicate] = await this.database
        .select({ id: supplier.id })
        .from(supplier)
        .where(and(eq(supplier.name, input.name), ne(supplier.id, input.id)))
        .limit(1);

      if (duplicate) {
        throw new ConflictException('Supplier with this name already exists');
      }
    }

    if (input.code) {
      const [existingByCode] = await this.database
        .select({ id: supplier.id })
        .from(supplier)
        .where(and(eq(supplier.code, input.code), ne(supplier.id, input.id)))
        .limit(1);

      if (existingByCode) {
        throw new ConflictException('Supplier with this code already exists');
      }
    }

    const [result] = await this.database
      .update(supplier)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.businessRegistrationNo !== undefined
          ? { businessRegistrationNo: input.businessRegistrationNo }
          : {}),
        ...(input.philGEPsNo !== undefined
          ? { philGEPsNo: input.philGEPsNo }
          : {}),
        ...(input.TIN !== undefined ? { tin: input.TIN } : {}),
        ...(input.VAT !== undefined ? { vat: input.VAT } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      })
      .where(eq(supplier.id, input.id))
      .returning();

    if (!result) {
      throw new NotFoundException(`Supplier with id ${input.id} not found`);
    }

    return result;
  }

  async delete(id: number) {
    const [result] = await this.database
      .delete(supplier)
      .where(eq(supplier.id, id))
      .returning();

    if (!result) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }

    return;
  }

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(supplier)
      .where(eq(supplier.id, id))
      .limit(1);

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      code: result.code,
      businessRegistrationNo: result.businessRegistrationNo,
      philGEPsNo: result.philGEPsNo,
      TIN: result.tin,
      VAT: result.vat,
      description: result.description,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      createdBy: result.createdBy,
      updatedBy: result.updatedBy,
    };
  }

  async findAll(input?: {
    search?: string;
    status?: 'active' | 'inactive';
    page?: number;
    pageSize?: number;
  }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.search) {
      conditions.push(ilike(supplier.name, `%${input.search}%`));
    }

    if (input?.status) {
      conditions.push(eq(supplier.status, input.status));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [rawItems, totals] = await Promise.all([
      this.database
        .select()
        .from(supplier)
        .where(where)
        .orderBy(asc(supplier.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(supplier).where(where),
    ]);

    const items = rawItems.map((item) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      businessRegistrationNo: item.businessRegistrationNo,
      philGEPsNo: item.philGEPsNo,
      TIN: item.tin,
      VAT: item.vat,
      description: item.description,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
    }));

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async findActive() {
    return this.database
      .select({
        id: supplier.id,
        name: supplier.name,
      })
      .from(supplier)
      .where(eq(supplier.status, 'active'))
      .orderBy(asc(supplier.name));
  }
}
