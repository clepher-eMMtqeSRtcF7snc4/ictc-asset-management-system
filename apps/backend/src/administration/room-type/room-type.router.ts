import { RoomTypeService } from './room-type.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  roomTypeSchema,
  roomTypeInput,
  updateRoomTypeInput,
  roomTypeListInputSchema,
  roomTypeListOutputSchema,
  CreateRoomTypeInput,
  UpdateRoomTypeInput,
  RoomTypeListInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class RoomTypeRouter {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Mutation({ input: roomTypeInput })
  async create(@Input() createRoomTypeInput: CreateRoomTypeInput) {
    return this.roomTypeService.create(createRoomTypeInput);
  }

  @Mutation({ input: updateRoomTypeInput })
  async update(@Input() updateRoomTypeInput: UpdateRoomTypeInput) {
    return this.roomTypeService.update(updateRoomTypeInput);
  }

  @Mutation({ input: roomTypeSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.roomTypeService.delete(input.id);
  }

  @Query({ input: roomTypeSchema.pick({ id: true }), output: roomTypeSchema })
  async getRoomTypeById(@Input() input: { id: number }) {
    return this.roomTypeService.findById(input.id);
  }

  @Query({ input: roomTypeListInputSchema, output: roomTypeListOutputSchema })
  async getRoomTypes(@Input() input: RoomTypeListInput) {
    return this.roomTypeService.findAll(input);
  }
}
