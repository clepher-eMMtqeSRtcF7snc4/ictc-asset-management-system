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
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from '@repo/trpc/schemas';
import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm';
import { department } from './schemas/schema';

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(department)
      .where(eq(department.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return result;
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
      conditions.push(
        or(
          ilike(department.name, `%${input.search}%`) as SQL,
          ilike(department.code, `%${input.search}%`) as SQL,
        ) as SQL,
      );
    }

    if (input?.status) {
      conditions.push(
        eq(department.status, input.status as 'active' | 'inactive'),
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const baseQuery = this.database.select().from(department);
    const whereQuery = where ? baseQuery.where(where) : baseQuery;

    const [items, totals] = await Promise.all([
      whereQuery
        .orderBy(asc(department.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      where
        ? this.database.select({ total: count() }).from(department).where(where)
        : this.database.select({ total: count() }).from(department),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async update(input: UpdateDepartmentInput) {
    await this.database
      .update(department)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.supervisorId !== undefined
          ? { supervisorId: input.supervisorId }
          : {}),
        ...(input.custodianId !== undefined
          ? { custodianId: input.custodianId }
          : {}),
        ...(input.logo !== undefined ? { logo: input.logo } : {}),
        ...(input.color !== undefined ? { color: input.color } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      })
      .where(eq(department.id, input.id));
  }

  async delete(id: number) {
    await this.database.delete(department).where(eq(department.id, id));
  }

  async create(createDepartmentInput: CreateDepartmentInput) {
    const [existing] = await this.database
      .select({ id: department.id })
      .from(department)
      .where(
        or(
          eq(department.name, createDepartmentInput.name),
          eq(department.code, createDepartmentInput.code),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ConflictException('Department already exists');
    }

    await this.database.insert(department).values({
      name: createDepartmentInput.name,
      code: createDepartmentInput.code,
      description: createDepartmentInput.description ?? null,
      supervisorId: createDepartmentInput.supervisorId ?? null,
      custodianId: createDepartmentInput.custodianId ?? null,
      logo: createDepartmentInput.logo ?? null,
      color: createDepartmentInput.color ?? null,
      status: 'active',
      createdAt: new Date(),
    });
  }
}
