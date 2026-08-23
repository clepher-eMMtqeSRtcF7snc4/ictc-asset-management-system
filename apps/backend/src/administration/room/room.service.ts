import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { schema } from '../../database/database.module';
import { CreateRoomInput } from '@repo/trpc/schemas';
import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm';
import { room } from './schemas/schema';

@Injectable()
export class RoomService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: number) {
    const [result] = await this.database
      .select()
      .from(room)
      .where(eq(room.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }

    return result;
  }

  async findAll(input?: {
    buildingId?: number;
    search?: string;
    status?: 'active' | 'inactive';
    floor?: '1st floor' | '2nd floor' | '3rd floor' | '4th floor';
    page?: number;
    pageSize?: number;
  }) {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 10;
    const conditions: SQL[] = [];

    if (input?.buildingId) {
      conditions.push(eq(room.buildingId, input.buildingId));
    }

    if (input?.search) {
      conditions.push(ilike(room.name, `%${input.search}%`));
    }

    if (input?.status) {
      conditions.push(eq(room.status, input.status));
    }

    if (input?.floor) {
      conditions.push(eq(room.floor, input.floor));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totals] = await Promise.all([
      this.database
        .select()
        .from(room)
        .where(where)
        .orderBy(asc(room.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.database.select({ total: count() }).from(room).where(where),
    ]);

    const total = totals[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  }

  async update(input: {
    id: number;
    name?: string;
    code?: string | null;
    roomTypeId?: number;
    buildingId?: number;
    floor?: '1st floor' | '2nd floor' | '3rd floor' | '4th floor';
    departmentId?: number | null;
  }) {
    await this.database
      .update(room)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.code !== undefined ? { code: input.code } : {}),
        ...(input.roomTypeId !== undefined
          ? { roomTypeId: input.roomTypeId }
          : {}),
        ...(input.buildingId !== undefined
          ? { buildingId: input.buildingId }
          : {}),
        ...(input.floor !== undefined ? { floor: input.floor } : {}),
        ...(input.departmentId !== undefined
          ? { departmentId: input.departmentId }
          : {}),
      })
      .where(eq(room.id, input.id));
  }

  async delete(id: number) {
    await this.database.delete(room).where(eq(room.id, id));
  }

  async create(createRoomInput: CreateRoomInput) {
    const [existing] = await this.database
      .select({ id: room.id })
      .from(room)
      .where(
        and(
          eq(room.name, createRoomInput.name),
          eq(room.buildingId, createRoomInput.buildingId),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ConflictException('Room already exists in this building');
    }

    await this.database.insert(room).values({
      name: createRoomInput.name,
      code: createRoomInput.code,
      roomTypeId: createRoomInput.roomTypeId,
      buildingId: createRoomInput.buildingId,
      floor: createRoomInput.floor,
      departmentId: createRoomInput.departmentId,
      status: 'active',
      createdAt: new Date(),
    });
  }
}
