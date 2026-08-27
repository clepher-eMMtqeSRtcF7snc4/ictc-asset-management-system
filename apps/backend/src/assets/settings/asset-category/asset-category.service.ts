import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../../database/database.module';
import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm';
import { assetCategory } from './schemas/schema';

@Injectable()
export class AssetCategoryService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(assetCategory)
      .where(eq(assetCategory.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Asset category with id ${id} not found`);
    }

    return result;
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
      conditions.push(ilike(assetCategory.name, `%${input.search}%`));
    }

    if (input?.status) {
      conditions.push(eq(assetCategory.status, input.status));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select()
        .from(assetCategory)
        .where(where)
        .orderBy(asc(assetCategory.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(assetCategory).where(where),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async update(input: {
    id: number;
    name?: string;
    description?: string | null;
    status?: 'active' | 'inactive';
  }) {
    await this.database
      .update(assetCategory)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      })
      .where(eq(assetCategory.id, input.id));
  }

  async delete(id: number) {
    await this.database.delete(assetCategory).where(eq(assetCategory.id, id));
  }

  async create(input: {
    name: string;
    description?: string | null;
    status: 'active' | 'inactive';
  }) {
    const [existing] = await this.database
      .select({ id: assetCategory.id })
      .from(assetCategory)
      .where(eq(assetCategory.name, input.name))
      .limit(1);

    if (existing) {
      throw new ConflictException('Asset category already exists');
    }

    await this.database.insert(assetCategory).values({
      name: input.name,
      description: input.description,
      status: input.status,
      createdAt: new Date(),
    });
  }
}
