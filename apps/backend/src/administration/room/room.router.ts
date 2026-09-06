import { RoomService } from './room.service';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import {
  roomListInputSchema,
  roomListOutputSchema,
  RoomListInput,
  CreateRoomInput,
  roomSchema,
  getBuildingByIdInputSchema,
  GetBuildingByIdInput,
  activeRoomListOutputSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { AppContext } from '../../app.context.interface';
import { RbacService } from '../rbac/authorization/rbac.service';
import { ForbiddenException } from '@nestjs/common';
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
  constructor(
    private readonly roomService: RoomService,
    private readonly rbacService: RbacService,
  ) {}

  @Mutation({ input: createRoomInputSchema })
  async create(
    @Input() createRoomInput: CreateRoomInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.manage');
    return this.roomService.create(createRoomInput);
  }

  @Mutation({ input: updateRoomInputSchema })
  async update(
    @Input() updateRoomInput: UpdateRoomInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.manage');
    return this.roomService.update(updateRoomInput);
  }

  @Mutation({ input: roomSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'office.manage');
    return this.roomService.delete(input.id);
  }

  @Query({ input: getBuildingByIdInputSchema, output: roomSchema })
  async getRoomById(
    @Input() input: GetBuildingByIdInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.read');
    return this.roomService.findById(input.id);
  }

  @Query({ input: roomListInputSchema, output: roomListOutputSchema })
  async getRooms(@Input() input: RoomListInput, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'office.read');
    return this.roomService.findAll(input);
  }

  @Query({
    input: z
      .object({
        buildingId: z.number().int().positive().optional(),
      })
      .default({}),
    output: activeRoomListOutputSchema,
  })
  async getActiveRooms(
    @Input() input: { buildingId?: number } = {},
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.read');
    return this.roomService.findActive(input);
  }

  @Query({
    input: z.object({}),
    output: z.record(z.string(), z.number().int().nonnegative()),
  })
  async getRoomCountsByBuilding(@Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'office.read');
    return this.roomService.countRoomsByBuilding();
  }

  private async checkPermission(ctx: AppContext, permissionCode: string) {
    if (!ctx.user?.id) {
      throw new ForbiddenException('Not authenticated');
    }

    const hasPermission = await this.rbacService.hasPermission(
      ctx.user.id,
      permissionCode,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `You do not have permission: ${permissionCode}`,
      );
    }
  }
}
