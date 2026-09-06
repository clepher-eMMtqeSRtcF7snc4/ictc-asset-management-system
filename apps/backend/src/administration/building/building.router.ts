import { BuildingService } from './building.service';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import {
  buildingListInputSchema,
  buildingListOutputSchema,
  BuildingListInput,
  CreateBuildingInput,
  buildingSchema,
  deleteBuildingInputSchema,
  getBuildingByIdInputSchema,
  GetBuildingByIdInput,
  UpdateBuildingInput,
  updateBuildingInputSchema,
  DeleteBuildingInput,
  createBuildingInputSchema,
  activeBuildingListOutputSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { AppContext } from '../../app.context.interface';
import { RbacService } from '../rbac/authorization/rbac.service';
import { ForbiddenException } from '@nestjs/common';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class BuildingRouter {
  constructor(
    private readonly buildingService: BuildingService,
    private readonly rbacService: RbacService,
  ) {}

  @Mutation({ input: createBuildingInputSchema })
  async create(
    @Input() createBuildingInput: CreateBuildingInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.manage');
    return this.buildingService.create(createBuildingInput);
  }

  @Mutation({ input: updateBuildingInputSchema })
  async update(
    @Input() updateBuildingInput: UpdateBuildingInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.manage');
    return this.buildingService.update(updateBuildingInput);
  }

  @Mutation({ input: deleteBuildingInputSchema })
  async delete(
    @Input() input: DeleteBuildingInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.manage');
    return this.buildingService.delete(input.id);
  }

  @Query({ input: getBuildingByIdInputSchema, output: buildingSchema })
  async getBuildingById(
    @Input() input: GetBuildingByIdInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.read');
    return this.buildingService.findById(input.id);
  }

  @Query({ input: buildingListInputSchema, output: buildingListOutputSchema })
  async getBuildings(
    @Input() input: BuildingListInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'office.read');
    return this.buildingService.findAll(input);
  }

  @Query({ output: activeBuildingListOutputSchema })
  async getActiveBuildings(@Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'office.read');
    return this.buildingService.findActive();
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
