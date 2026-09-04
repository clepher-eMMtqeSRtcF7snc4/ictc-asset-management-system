import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../../database/database.module';
import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm';
import { permissions, permissionStatus } from './schemas/schema';

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
}

@Injectable()
export class PermissionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findPermissions(input?: {
    module?: string;
    action?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.module) {
      conditions.push(eq(permissions.module, input.module));
    }

    if (input?.action) {
      conditions.push(eq(permissions.action, input.action));
    }

    if (input?.search) {
      conditions.push(
        or(
          ilike(permissions.name, `%${input.search}%`),
          ilike(permissions.description, `%${input.search}%`),
          ilike(permissions.code, `%${input.search}%`),
        ) as SQL,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result, totalResult] = await Promise.all([
      this.database
        .select()
        .from(permissions)
        .where(where)
        .orderBy(asc(permissions.module), asc(permissions.action))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ count: count() }).from(permissions).where(where),
    ]);

    return {
      data: result,
      total: totalResult[0]?.count ?? 0,
      page,
      pageSize,
    };
  }

  async findPermissionById(id: string) {
    const [result] = await this.database
      .select()
      .from(permissions)
      .where(eq(permissions.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    return result;
  }

  async findPermissionByCode(code: string) {
    const [result] = await this.database
      .select()
      .from(permissions)
      .where(eq(permissions.code, code))
      .limit(1);

    return result || null;
  }

  async createPermission(input: {
    code: string;
    name: string;
    description?: string;
    module: string;
    action: string;
  }) {
    const existing = await this.findPermissionByCode(input.code);
    if (existing) {
      throw new ConflictException(
        `Permission with code ${input.code} already exists`,
      );
    }

    const [permission] = await this.database
      .insert(permissions)
      .values({
        id: crypto.randomUUID(),
        code: input.code,
        name: input.name,
        description: input.description ?? null,
        module: input.module,
        action: input.action,
      })
      .returning();

    return permission;
  }

  async updatePermission(
    id: string,
    input: {
      code?: string;
      name?: string;
      description?: string;
      module?: string;
      action?: string;
    },
  ) {
    const permission = await this.findPermissionById(id);

    if (input.code && input.code !== permission.code) {
      const existing = await this.findPermissionByCode(input.code);
      if (existing) {
        throw new ConflictException(
          `Permission with code ${input.code} already exists`,
        );
      }
    }

    const [updated] = await this.database
      .update(permissions)
      .set({
        ...(input.code !== undefined && { code: input.code }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.module !== undefined && { module: input.module }),
        ...(input.action !== undefined && { action: input.action }),
      })
      .where(eq(permissions.id, id))
      .returning();

    return updated;
  }

  async deletePermission(id: string) {
    await this.findPermissionById(id);
    await this.database.delete(permissions).where(eq(permissions.id, id));
  }

  async getModules() {
    const result = await this.database
      .select({ module: permissions.module })
      .from(permissions)
      .groupBy(permissions.module)
      .orderBy(asc(permissions.module));

    return result.map((r) => r.module);
  }
}
