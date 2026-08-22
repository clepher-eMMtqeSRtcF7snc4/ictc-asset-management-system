import { BuildingService } from './building.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
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
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class BuildingRouter {
  constructor(private readonly buildingService: BuildingService) {}

  @Mutation({ input: createBuildingInputSchema })
  async create(@Input() createBuildingInput: CreateBuildingInput) {
    return this.buildingService.create(createBuildingInput);
  }

  @Mutation({ input: updateBuildingInputSchema })
  async update(@Input() updateBuildingInput: UpdateBuildingInput) {
    return this.buildingService.update(updateBuildingInput);
  }

  @Mutation({ input: deleteBuildingInputSchema })
  async delete(@Input() input: DeleteBuildingInput) {
    return this.buildingService.delete(input.id);
  }

  @Query({ input: getBuildingByIdInputSchema, output: buildingSchema })
  async getBuildingById(@Input() input: GetBuildingByIdInput) {
    return this.buildingService.findById(input.id);
  }

  @Query({ input: buildingListInputSchema, output: buildingListOutputSchema })
  async getBuildings(@Input() input: BuildingListInput) {
    return this.buildingService.findAll(input);
  }
}
