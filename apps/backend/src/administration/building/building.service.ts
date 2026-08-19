import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { CreateBuildingInput } from '@repo/trpc/schemas';
import { building } from './schemas/schema';

@Injectable()
export class BuildingService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

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
