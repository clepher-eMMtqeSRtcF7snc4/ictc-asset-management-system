import { BuildingService } from './building.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  buildingListOutputSchema,
  CreateBuildingInput,
  createBuildingInputSchema,
  buildingIdSchema,
  GetBuildingInput
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

  // @Query({ output: buildingListOutputSchema })
  // async getBuildings(@Input() getBuildingsInput: GetBuildingInput){
  //   return this.buildingService.getBuildings
  // }

}
