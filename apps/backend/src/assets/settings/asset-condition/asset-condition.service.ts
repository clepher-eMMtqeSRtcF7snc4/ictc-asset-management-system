import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/database.module';
import { assetCondition } from './schemas/schema';
import { and, asc, count, eq, ilike, ne, type SQL } from 'drizzle-orm';

@Injectable()
export class AssetConditionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(input: {
    name: string;
    code: string;
    description?: string | null;
    status: 'active' | 'inactive';
  }) {
    const [existingByName] = await this.database
      .select({ id: assetCondition.id })
      .from(assetCondition)
      .where(eq(assetCondition.name, input.name))
      .limit(1);

    if (existingByName) {
      throw new ConflictException('Asset condition with this name already exists');
    }

    const [existingByCode] = await this.database
      .select({ id: assetCondition.id })
      .from(assetCondition)
      .where(eq(assetCondition.code, input.code))
      .limit(1);

    if (existingByCode) {
      throw new ConflictException('Asset condition with this code already exists');
    }

    const [result] = await this.database
      .insert(assetCondition)
      .values({
        name: input.name,
        code: input.code,
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
    description?: string | null;
    status?: 'active' | 'inactive';
  }) {
    if (input.name) {
      const [duplicate] = await this.database
        .select({ id: assetCondition.id })
        .from(assetCondition)
        .where(and(eq(assetCondition.name, input.name), ne(assetCondition.id, input.id)))
        .limit(1);
      
      if (duplicate) {
        throw new ConflictException('Asset condition with this name already exists');
      }
    }

    if (input.code) {
      const [existingByCode] = await this.database
        .select({ id: assetCondition.id })
        .from(assetCondition)
        .where(and(eq(assetCondition.code, input.code), ne(assetCondition.id, input.id)))
        .limit(1);
      
      if (existingByCode) {
        throw new ConflictException('Asset condition with this code already exists');
      }
    }

    const [result] = await this.database
      .update(assetCondition)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      })
      .where(eq(assetCondition.id, input.id))
      .returning();

    if (!result) {
      throw new NotFoundException(`Asset condition with id ${input.id} not found`);
    }

    return result;
  }

  async delete(id: number) {
    const [result] = await this.database
      .delete(assetCondition)
      .where(eq(assetCondition.id, id))
      .returning();

    if (!result) {
      throw new NotFoundException(`Asset condition with id ${id} not found`);
    }

    return;
  }

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(assetCondition)
      .where(eq(assetCondition.id, id))
      .limit(1);

    return result ?? null;
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
      conditions.push(
        ilike(assetCondition.name, `%${input.search}%`),
      );
    }

    if (input?.status) {
      conditions.push(eq(assetCondition.status, input.status));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select()
        .from(assetCondition)
        .where(where)
        .orderBy(asc(assetCondition.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(assetCondition).where(where),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }
}