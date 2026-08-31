import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/database.module';
import { assetStatus } from './schemas/schema';
import { and, asc, count, eq, ilike, ne, type SQL } from 'drizzle-orm';

@Injectable()
export class AssetStatusService {
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
      .select({ id: assetStatus.id })
      .from(assetStatus)
      .where(eq(assetStatus.name, input.name))
      .limit(1);

    if (existingByName) {
      throw new ConflictException('Asset status with this name already exists');
    }

    const [existingByCode] = await this.database
      .select({ id: assetStatus.id })
      .from(assetStatus)
      .where(eq(assetStatus.code, input.code))
      .limit(1);

    if (existingByCode) {
      throw new ConflictException('Asset status with this code already exists');
    }

    const [result] = await this.database
      .insert(assetStatus)
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
        .select({ id: assetStatus.id })
        .from(assetStatus)
        .where(
          and(eq(assetStatus.name, input.name), ne(assetStatus.id, input.id)),
        )
        .limit(1);

      if (duplicate) {
        throw new ConflictException(
          'Asset status with this name already exists',
        );
      }
    }

    if (input.code) {
      const [existingByCode] = await this.database
        .select({ id: assetStatus.id })
        .from(assetStatus)
        .where(
          and(eq(assetStatus.code, input.code), ne(assetStatus.id, input.id)),
        )
        .limit(1);

      if (existingByCode) {
        throw new ConflictException(
          'Asset status with this code already exists',
        );
      }
    }

    const [result] = await this.database
      .update(assetStatus)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      })
      .where(eq(assetStatus.id, input.id))
      .returning();

    if (!result) {
      throw new NotFoundException(`Asset status with id ${input.id} not found`);
    }

    return result;
  }

  async delete(id: number) {
    const [result] = await this.database
      .delete(assetStatus)
      .where(eq(assetStatus.id, id))
      .returning();

    if (!result) {
      throw new NotFoundException(`Asset status with id ${id} not found`);
    }

    return;
  }

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(assetStatus)
      .where(eq(assetStatus.id, id))
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
      conditions.push(ilike(assetStatus.name, `%${input.search}%`));
    }

    if (input?.status) {
      conditions.push(eq(assetStatus.status, input.status));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select()
        .from(assetStatus)
        .where(where)
        .orderBy(asc(assetStatus.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(assetStatus).where(where),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }
}
