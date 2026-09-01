import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/database.module';
import { assetType } from './schemas/schema';
import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm';

@Injectable()
export class AssetTypeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(input: {
    name: string;
    code: string;
    assetCategoryId: number;
    description?: string | null;
    depreciable: boolean;
    defaultUsefulLife?: number | null;
    status: 'active' | 'inactive';
  }) {
    const [result] = await this.database
      .insert(assetType)
      .values({
        name: input.name,
        code: input.code,
        assetCategoryId: input.assetCategoryId,
        description: input.description ?? null,
        depreciable: input.depreciable,
        defaultUsefulLife: input.defaultUsefulLife ?? null,
        status: input.status,
      })
      .returning();

    return result;
  }

  async update(input: {
    id: number;
    name?: string;
    code?: string;
    assetCategoryId?: number;
    description?: string | null;
    depreciable?: boolean;
    defaultUsefulLife?: number | null;
    status?: 'active' | 'inactive';
  }) {
    const [result] = await this.database
      .update(assetType)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.assetCategoryId !== undefined
          ? { assetCategoryId: input.assetCategoryId }
          : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.depreciable !== undefined
          ? { depreciable: input.depreciable }
          : {}),
        ...(input.defaultUsefulLife !== undefined
          ? { defaultUsefulLife: input.defaultUsefulLife }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(assetType.id, input.id))
      .returning();

    if (!result) {
      throw new Error(`Asset type with id ${input.id} not found`);
    }

    return result[0];
  }

  async delete(id: number) {
    const [result] = await this.database
      .delete(assetType)
      .where(eq(assetType.id, id))
      .returning();

    if (!result) {
      throw new Error(`Asset type with id ${id} not found`);
    }

    return;
  }

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(assetType)
      .where(eq(assetType.id, id))
      .limit(1);

    return result ?? null;
  }

  async findActive(input?: { assetCategoryId?: number }) {
    const conditions: SQL[] = [eq(assetType.status, 'active')];

    if (input?.assetCategoryId !== undefined) {
      conditions.push(eq(assetType.assetCategoryId, input.assetCategoryId));
    }

    return this.database
      .select({
        id: assetType.id,
        name: assetType.name,
      })
      .from(assetType)
      .where(and(...conditions))
      .orderBy(asc(assetType.name));
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
        ilike(assetType.name, `%${input.search}%`),
        ilike(assetType.code, `%${input.search}%`),
      );
    }

    if (input?.status) {
      conditions.push(eq(assetType.status, input.status));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select()
        .from(assetType)
        .where(where)
        .orderBy(asc(assetType.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(assetType).where(where),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }
}
