import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import {
  type CreateDepartmentInput,
  type DepartmentListInput,
  type SetDepartmentStatusInput,
  type UpdateDepartmentInput,
} from '@repo/trpc/schemas';
import { departments } from '../../auth/schema';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { schema } from '../../database/database.module';

@Injectable()
export class DepartmentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async list(input: DepartmentListInput) {
    return this.database
      .select(this.selection())
      .from(departments)
      .where(this.listConditions(input))
      .orderBy(asc(departments.name));
  }

  async create(input: CreateDepartmentInput) {
    const [department] = await this.database
      .insert(departments)
      .values(input)
      .returning(this.selection());

    return department;
  }

  async update(input: UpdateDepartmentInput) {
    const { id, ...updates } = input;
    const [department] = await this.database
      .update(departments)
      .set(updates)
      .where(eq(departments.id, id))
      .returning(this.selection());

    return this.requireDepartment(department);
  }

  async setStatus(input: SetDepartmentStatusInput) {
    const [department] = await this.database
      .update(departments)
      .set({ status: input.status })
      .where(eq(departments.id, input.id))
      .returning(this.selection());

    return this.requireDepartment(department);
  }

  private selection() {
    return {
      id: departments.id,
      name: departments.name,
      code: departments.code,
      type: departments.type,
      status: departments.status,
    };
  }

  private listConditions(input: DepartmentListInput): SQL | undefined {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(
        or(
          ilike(departments.name, `%${input.search}%`),
          ilike(departments.code, `%${input.search}%`),
        )!,
      );
    }
    if (input.status) conditions.push(eq(departments.status, input.status));
    if (input.type) conditions.push(eq(departments.type, input.type));

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  private requireDepartment<T>(department: T | undefined): T {
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }
}
