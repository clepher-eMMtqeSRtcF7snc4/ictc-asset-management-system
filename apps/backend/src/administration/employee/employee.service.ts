import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@repo/trpc/schemas';
import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm';
import { employee } from './schemas/schema';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(employee)
      .where(eq(employee.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return result;
  }

  async findAll(input?: {
    search?: string;
    departmentId?: number;
    positionId?: number | string;
    designationId?: number | string;
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
          ilike(employee.firstName, `%${input.search}%`),
          ilike(employee.lastName, `%${input.search}%`),
          ilike(employee.email, `%${input.search}%`),
        ) as SQL,
      );
    }

    if (input?.departmentId) {
      conditions.push(eq(employee.departmentId, input.departmentId));
    }

    if (input?.positionId) {
      conditions.push(eq(employee.positionId, Number(input.positionId)));
    }

    if (input?.designationId) {
      conditions.push(eq(employee.designationId, Number(input.designationId)));
    }

    if (input?.status) {
      conditions.push(
        eq(employee.status, input.status as 'active' | 'inactive' | 'retire'),
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const baseQuery = this.database.select().from(employee);
    const whereQuery = where ? baseQuery.where(where) : baseQuery;

    const [items, totals] = await Promise.all([
      whereQuery
        .orderBy(asc(employee.lastName))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      where
        ? this.database.select({ total: count() }).from(employee).where(where)
        : this.database.select({ total: count() }).from(employee),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async update(input: UpdateEmployeeInput) {
    await this.database
      .update(employee)
      .set({
        ...(input.firstName !== undefined
          ? { firstName: input.firstName }
          : {}),
        ...(input.middleName !== undefined
          ? { middleName: input.middleName }
          : {}),
        ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.position !== undefined
          ? { positionId: Number(input.position) }
          : {}),
        ...(input.designation !== undefined
          ? { designationId: Number(input.designation) }
          : {}),
        ...(input.departmentId !== undefined
          ? { departmentId: input.departmentId }
          : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.status !== undefined
          ? { status: input.status as 'active' | 'inactive' | 'retire' }
          : {}),
        ...(input.photo !== undefined ? { photo: input.photo } : {}),
      })
      .where(eq(employee.id, input.id));
  }

  async delete(id: number) {
    await this.database.delete(employee).where(eq(employee.id, id));
  }

  async create(createEmployeeInput: CreateEmployeeInput) {
    const [existing] = await this.database
      .select({ id: employee.id })
      .from(employee)
      .where(eq(employee.email, createEmployeeInput.email))
      .limit(1);

    if (existing) {
      throw new ConflictException('Employee with this email already exists');
    }

    await this.database.insert(employee).values({
      firstName: createEmployeeInput.firstName,
      middleName: createEmployeeInput.middleName ?? null,
      lastName: createEmployeeInput.lastName,
      email: createEmployeeInput.email,
      positionId: Number(createEmployeeInput.position),
      designationId: Number(createEmployeeInput.designation),
      departmentId: createEmployeeInput.departmentId,
      role: createEmployeeInput.role ?? null,
      status: createEmployeeInput.status as 'active' | 'inactive' | 'retire',
      photo: createEmployeeInput.photo ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
