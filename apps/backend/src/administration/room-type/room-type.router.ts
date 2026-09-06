import { RoomTypeService } from './room-type.service';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
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
import { AppContext } from '../../app.context.interface';
import { RbacService } from '../rbac/authorization/rbac.service';
import { ForbiddenException } from '@nestjs/common';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class RoomTypeRouter {
  constructor(
    private readonly roomTypeService: RoomTypeService,
    private readonly rbacService: RbacService,
  ) {}

  @Mutation({ input: roomTypeInput })
  async create(
    @Input() createRoomTypeInput: CreateRoomTypeInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.manage');
    return this.roomTypeService.create(createRoomTypeInput);
  }

  @Mutation({ input: updateRoomTypeInput })
  async update(
    @Input() updateRoomTypeInput: UpdateRoomTypeInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.manage');
    return this.roomTypeService.update(updateRoomTypeInput);
  }

  @Mutation({ input: roomTypeSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'office.manage');
    return this.roomTypeService.delete(input.id);
  }

  @Query({ input: roomTypeSchema.pick({ id: true }), output: roomTypeSchema })
  async getRoomTypeById(
    @Input() input: { id: number },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.read');
    return this.roomTypeService.findById(input.id);
  }

  @Query({ input: roomTypeListInputSchema, output: roomTypeListOutputSchema })
  async getRoomTypes(
    @Input() input: RoomTypeListInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.read');
    return this.roomTypeService.findAll(input);
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
