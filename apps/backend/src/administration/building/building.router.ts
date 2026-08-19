import { BuildingService } from './building.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  buildingListInputSchema,
  buildingListOutputSchema,
  BuildingListInput,
  CreateBuildingInput,
  createBuildingInputSchema,
  buildingIdSchema,
  buildingSchema,
  getBuildingByIdInputSchema,
  GetBuildingByIdInput,
  UpdateBuildingInput,
  updateBuildingInputSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class BuildingRouter {
  constructor(private readonly buildingService: BuildingService) {}

  @Mutation({ input: createBuildingInputSchema })
  async create(@Input() createLocationInput: CreateBuildingInput) {
    return this.buildingService.create(createLocationInput);
  }

  @Mutation({ input: updateBuildingInputSchema })
  async update(@Input() updateBuildingInput: UpdateBuildingInput) {
    return this.buildingService.update(updateBuildingInput);
  }

  @Query({ input: getBuildingByIdInputSchema, output: buildingSchema })
  async getBuildingById(@Input() input: GetBuildingByIdInput) {
    return this.buildingService.findById(input.id);
  }

  @Query({ input: buildingListInputSchema, output: buildingListOutputSchema })
  async getBuildings(@Input() input: BuildingListInput){
    return this.buildingService.findAll(input);
  }
}
