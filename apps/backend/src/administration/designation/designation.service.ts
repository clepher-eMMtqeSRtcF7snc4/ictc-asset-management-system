import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import {
  CreateDesignationInput,
  UpdateDesignationInput,
} from '@repo/trpc/schemas';
import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm';
import { designation } from './schemas/schema';

@Injectable()
export class DesignationService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number | string) {
    const numericId = Number(id);
    const [result] = await this.database
      .select()
      .from(designation)
      .where(eq(designation.id, numericId))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Designation with id ${id} not found`);
    }

    return {
      ...result,
      id: String(result.id),
      employeeCount: 0,
    };
  }

  async findAll(input?: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.search) {
      conditions.push(ilike(designation.name, `%${input.search}%`));
    }

    if (input?.status) {
      conditions.push(
        eq(designation.status, input.status as 'active' | 'inactive'),
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const baseQuery = this.database.select().from(designation);
    const whereQuery = where ? baseQuery.where(where) : baseQuery;

    const [items, totals] = await Promise.all([
      whereQuery
        .orderBy(asc(designation.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      where
        ? this.database
            .select({ total: count() })
            .from(designation)
            .where(where)
        : this.database.select({ total: count() }).from(designation),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const mappedItems = items.map((item) => ({
      ...item,
      id: String(item.id),
      employeeCount: 0,
    }));

    return { items: mappedItems, total, page, pageSize, totalPages };
  }

  async update(input: UpdateDesignationInput) {
    await this.database
      .update(designation)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      })
      .where(eq(designation.id, Number(input.id)));
  }

  async delete(id: number | string) {
    await this.database.delete(designation).where(eq(designation.id, Number(id)));
  }

  async create(createDesignationInput: CreateDesignationInput) {
    const [existing] = await this.database
      .select({ id: designation.id })
      .from(designation)
      .where(eq(designation.name, createDesignationInput.name))
      .limit(1);

    if (existing) {
      throw new ConflictException('Designation with this name already exists');
    }

    await this.database.insert(designation).values({
      name: createDesignationInput.name,
      status: createDesignationInput.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
