import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { CreateRoomTypeInput, UpdateRoomTypeInput } from '@repo/trpc/schemas';
import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm';
import { roomType } from './schemas/schema';

@Injectable()
export class RoomTypeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(roomType)
      .where(eq(roomType.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Room type with id ${id} not found`);
    }

    return result;
  }

  async findAll(input?: { search?: string; page?: number; pageSize?: number }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.search) {
      conditions.push(ilike(roomType.name, `%${input.search}%`));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select()
        .from(roomType)
        .where(where)
        .orderBy(asc(roomType.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(roomType).where(where),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async update(input: UpdateRoomTypeInput) {
    await this.database
      .update(roomType)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
      })
      .where(eq(roomType.id, input.id));
  }

  async delete(id: number) {
    await this.database.delete(roomType).where(eq(roomType.id, id));
  }

  async create(createRoomTypeInput: CreateRoomTypeInput) {
    const [existing] = await this.database
      .select({ id: roomType.id })
      .from(roomType)
      .where(
        or(
          eq(roomType.name, createRoomTypeInput.name),
          eq(roomType.code, createRoomTypeInput.code ?? ''),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ConflictException('Room type already exists');
    }

    await this.database.insert(roomType).values({
      name: createRoomTypeInput.name,
      code: createRoomTypeInput.code,
      createdAt: new Date(),
    });
  }
}
