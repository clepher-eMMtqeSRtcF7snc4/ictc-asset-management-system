import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import {
  type CategoryListInput,
  type CreateCategoryInput,
  type SetCategoryStatusInput,
  type UpdateCategoryInput,
} from '@repo/trpc/schemas';
import { categories } from '../auth/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { schema } from '../database/database.module';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async list(input: CategoryListInput) {
    return this.database
      .select(this.selection())
      .from(categories)
      .where(this.listConditions(input))
      .orderBy(asc(categories.name));
  }

  async create(input: CreateCategoryInput) {
    const [category] = await this.database
      .insert(categories)
      .values(input)
      .returning(this.selection());

    return category;
  }

  async update(input: UpdateCategoryInput) {
    const { id, ...updates } = input;
    const [category] = await this.database
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning(this.selection());

    return this.requireCategory(category);
  }

  async setStatus(input: SetCategoryStatusInput) {
    const [category] = await this.database
      .update(categories)
      .set({ status: input.status })
      .where(eq(categories.id, input.id))
      .returning(this.selection());

    return this.requireCategory(category);
  }

  private selection() {
    return {
      id: categories.id,
      name: categories.name,
      code: categories.code,
      type: categories.type,
      status: categories.status,
    };
  }

  private listConditions(input: CategoryListInput): SQL | undefined {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(
        or(
          ilike(categories.name, `%${input.search}%`),
          ilike(categories.code, `%${input.search}%`),
        )!,
      );
    }
    if (input.status) conditions.push(eq(categories.status, input.status));
    if (input.type) conditions.push(eq(categories.type, input.type));

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  private requireCategory<T>(category: T | undefined): T {
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
