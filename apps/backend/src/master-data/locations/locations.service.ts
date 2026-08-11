import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, ilike, or, type SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import {
  type CreateLocationInput,
  type LocationListInput,
  type SetLocationStatusInput,
  type UpdateLocationInput,
} from '@repo/trpc/schemas';
import { locations } from '../../auth/schema';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { schema } from '../../database/database.module';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async list(input: LocationListInput) {
    return this.database
      .select(this.selection())
      .from(locations)
      .where(this.listConditions(input))
      .orderBy(asc(locations.name));
  }

  async create(input: CreateLocationInput) {
    const [location] = await this.database
      .insert(locations)
      .values(input)
      .returning(this.selection());

    return location;
  }

  async update(input: UpdateLocationInput) {
    const { id, ...updates } = input;
    const [location] = await this.database
      .update(locations)
      .set(updates)
      .where(eq(locations.id, id))
      .returning(this.selection());

    return this.requireLocation(location);
  }

  async setStatus(input: SetLocationStatusInput) {
    const [location] = await this.database
      .update(locations)
      .set({ status: input.status })
      .where(eq(locations.id, input.id))
      .returning(this.selection());

    return this.requireLocation(location);
  }

  private selection() {
    return {
      id: locations.id,
      name: locations.name,
      code: locations.code,
      type: locations.type,
      status: locations.status,
    };
  }

  private listConditions(input: LocationListInput): SQL | undefined {
    const conditions: SQL[] = [];

    if (input.search) {
      conditions.push(
        or(
          ilike(locations.name, `%${input.search}%`),
          ilike(locations.code, `%${input.search}%`),
        )!,
      );
    }
    if (input.status) conditions.push(eq(locations.status, input.status));
    if (input.type) conditions.push(eq(locations.type, input.type));

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  private requireLocation<T>(location: T | undefined): T {
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }
}
