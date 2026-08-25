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
import { and, asc, count, eq, ilike, or, sql, type SQL } from 'drizzle-orm';
import { employee } from './schemas/schema';
import { position } from '../position/schemas/schema';
import { designation } from '../designation/schemas/schema';
import { department } from '../department/schemas/schema';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number) {
    const [result] = await this.database
      .select({
        id: employee.id,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        email: employee.email,
        positionId: employee.positionId,
        designationId: employee.designationId,
        departmentId: employee.departmentId,
        role: employee.role,
        status: employee.status,
        photo: employee.photo,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      })
      .from(employee)
      .leftJoin(position, eq(employee.positionId, position.id))
      .leftJoin(designation, eq(employee.designationId, designation.id))
      .where(eq(employee.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return {
      ...result,
      position: result.positionId != null ? String(result.positionId) : null,
      designation: result.designationId != null ? String(result.designationId) : null,
    };
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

    const search = input?.search;
    if (search) {
      conditions.push(
        or(
          ilike(employee.firstName, `%${search}%`),
          ilike(employee.lastName, `%${search}%`),
          ilike(employee.email, `%${search}%`),
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
        eq(employee.status, input.status as any),
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select({
          id: employee.id,
          firstName: employee.firstName,
          middleName: employee.middleName,
          lastName: employee.lastName,
          email: employee.email,
          positionId: employee.positionId,
          designationId: employee.designationId,
          departmentId: employee.departmentId,
          role: employee.role,
          status: employee.status,
          photo: employee.photo,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        })
        .from(employee)
        .leftJoin(position, eq(employee.positionId, position.id))
        .leftJoin(designation, eq(employee.designationId, designation.id))
        .where(where)
        .orderBy(asc(employee.lastName))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      where
        ? this.database.select({ total: count() }).from(employee).where(where)
        : this.database.select({ total: count() }).from(employee),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const mappedItems = items.map((item) => ({
      ...item,
      position: item.positionId != null ? String(item.positionId) : null,
      designation: item.designationId != null ? String(item.designationId) : null,
    }));

    return { items: mappedItems, total, page, pageSize, totalPages };
  }

  async update(input: UpdateEmployeeInput) {
    const result = await this.database
      .update(employee)
      .set({
        ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
        ...(input.middleName !== undefined ? { middleName: input.middleName } : {}),
        ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.position !== undefined && input.position !== ""
          ? { positionId: Number(input.position) }
          : {}),
        ...(input.designation !== undefined && input.designation !== ""
          ? { designationId: Number(input.designation) }
          : {}),
        ...(input.departmentId !== undefined
          ? { departmentId: input.departmentId }
          : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.status !== undefined
          ? { status: ((input.status as string) === 'retire' ? 'retired' : input.status) as any }
          : {}),
        ...(input.photo !== undefined ? { photo: input.photo } : {}),
      })
      .where(eq(employee.id, input.id))
      .returning();

    if (!result[0]) {
      throw new NotFoundException(`Employee with id ${input.id} not found`);
    }

    return result[0];
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
      positionId: createEmployeeInput.position ? Number(createEmployeeInput.position) : null,
      designationId: createEmployeeInput.designation ? Number(createEmployeeInput.designation) : null,
      departmentId: createEmployeeInput.departmentId,
      role: createEmployeeInput.role ?? null,
      status: ((createEmployeeInput.status as string) === 'retire' ? 'retired' : createEmployeeInput.status) as any,
      photo: createEmployeeInput.photo ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
