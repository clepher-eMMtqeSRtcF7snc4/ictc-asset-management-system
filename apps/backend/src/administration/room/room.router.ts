import { RoomService } from './room.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  roomListInputSchema,
  roomListOutputSchema,
  RoomListInput,
  CreateRoomInput,
  roomSchema,
  getBuildingByIdInputSchema,
  GetBuildingByIdInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { z } from 'zod';

const createRoomInputSchema = z.object({
  name: z.string().trim().min(1, 'This field is required').max(150),
  code: z.string().trim().max(50).optional().nullable(),
  roomTypeId: z.number().int().positive(),
  buildingId: z.number().int().positive(),
  floor: z.enum(['1st floor', '2nd floor', '3rd floor', '4th floor']),
  departmentId: z.number().int().positive().nullable(),
});

const updateRoomInputSchema = createRoomInputSchema.partial().extend({
  id: z.number().int().positive(),
});

export type UpdateRoomInput = z.infer<typeof updateRoomInputSchema>;

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class RoomRouter {
  constructor(private readonly roomService: RoomService) {}

  @Mutation({ input: createRoomInputSchema })
  async create(@Input() createRoomInput: CreateRoomInput) {
    return this.roomService.create(createRoomInput);
  }

  @Mutation({ input: updateRoomInputSchema })
  async update(@Input() updateRoomInput: UpdateRoomInput) {
    return this.roomService.update(updateRoomInput);
  }

  @Mutation({ input: roomSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.roomService.delete(input.id);
  }

  @Query({ input: getBuildingByIdInputSchema, output: roomSchema })
  async getRoomById(@Input() input: GetBuildingByIdInput) {
    return this.roomService.findById(input.id);
  }

  @Query({ input: roomListInputSchema, output: roomListOutputSchema })
  async getRooms(@Input() input: RoomListInput) {
    return this.roomService.findAll(input);
  }
}
