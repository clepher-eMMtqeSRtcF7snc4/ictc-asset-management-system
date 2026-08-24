import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { CreatePositionInput, UpdatePositionInput } from '@repo/trpc/schemas';
import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm';
import { position } from './schemas/schema';

@Injectable()
export class PositionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number | string) {
    const numericId = Number(id);
    const [result] = await this.database
      .select()
      .from(position)
      .where(eq(position.id, numericId))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Position with id ${id} not found`);
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
      conditions.push(ilike(position.name, `%${input.search}%`));
    }

    if (input?.status) {
      conditions.push(
        eq(position.status, input.status as 'active' | 'inactive'),
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const baseQuery = this.database.select().from(position);
    const whereQuery = where ? baseQuery.where(where) : baseQuery;

    const [items, totals] = await Promise.all([
      whereQuery
        .orderBy(asc(position.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      where
        ? this.database.select({ total: count() }).from(position).where(where)
        : this.database.select({ total: count() }).from(position),
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

  async update(input: UpdatePositionInput) {
    await this.database
      .update(position)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      })
      .where(eq(position.id, Number(input.id)));
  }

  async delete(id: number | string) {
    await this.database.delete(position).where(eq(position.id, Number(id)));
  }

  async create(createPositionInput: CreatePositionInput) {
    const [existing] = await this.database
      .select({ id: position.id })
      .from(position)
      .where(eq(position.name, createPositionInput.name))
      .limit(1);

    if (existing) {
      throw new ConflictException('Position with this name already exists');
    }

    await this.database.insert(position).values({
      name: createPositionInput.name,
      status: createPositionInput.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
