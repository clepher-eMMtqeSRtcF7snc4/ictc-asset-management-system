import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { CreateBuildingInput, UpdateBuildingInput } from '@repo/trpc/schemas';
import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm';
import { building } from './schemas/schema';

@Injectable()
export class BuildingService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(building)
      .where(eq(building.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Building with id ${id} not found`);
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
      conditions.push(ilike(building.name, `%${input.search}%`));
    }

    if (input?.status) {
      conditions.push(eq(building.status, input.status));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select()
        .from(building)
        .where(where)
        .orderBy(asc(building.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(building).where(where),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async update(input: UpdateBuildingInput) {
    await this.database
      .update(building)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
      })
      .where(eq(building.id, input.id));
  }

  async create(createBuildingInput: CreateBuildingInput) {
    await this.database.insert(building).values({
      name: createBuildingInput.name,
      code: createBuildingInput.code,
      status: createBuildingInput.status,
      description: createBuildingInput.description,
      createdAt: new Date(),
    });
  }
}
