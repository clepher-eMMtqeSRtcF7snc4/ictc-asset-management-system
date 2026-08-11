import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  createLocationInputSchema,
  locationListInputSchema,
  locationListOutputSchema,
  locationSchema,
  setLocationStatusInputSchema,
  updateLocationInputSchema,
  type CreateLocationInput,
  type LocationListInput,
  type SetLocationStatusInput,
  type UpdateLocationInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { LocationsService } from './locations.service';

@Router({ alias: 'locationsRouter' })
@UseMiddlewares(AuthTrpcMiddleware)
export class LocationsRouter {
  constructor(private readonly locationsService: LocationsService) {}

  @Query({ input: locationListInputSchema, output: locationListOutputSchema })
  async list(@Input() input: LocationListInput) {
    return this.locationsService.list(input);
  }

  @Mutation({ input: createLocationInputSchema, output: locationSchema })
  async create(@Input() input: CreateLocationInput) {
    return this.locationsService.create(input);
  }

  @Mutation({ input: updateLocationInputSchema, output: locationSchema })
  async update(@Input() input: UpdateLocationInput) {
    return this.locationsService.update(input);
  }

  @Mutation({ input: setLocationStatusInputSchema, output: locationSchema })
  async setStatus(@Input() input: SetLocationStatusInput) {
    return this.locationsService.setStatus(input);
  }
}
