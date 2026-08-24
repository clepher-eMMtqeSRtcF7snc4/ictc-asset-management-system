import { PositionService } from './position.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  createPositionInputSchema,
  updatePositionInputSchema,
  positionSchema,
  positionListInputSchema,
  positionListOutputSchema,
  CreatePositionInput,
  UpdatePositionInput,
  PositionListInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class PositionRouter {
  constructor(private readonly positionService: PositionService) {}

  @Mutation({ input: createPositionInputSchema })
  async create(@Input() createPositionInput: CreatePositionInput) {
    return this.positionService.create(createPositionInput);
  }

  @Mutation({ input: updatePositionInputSchema })
  async update(@Input() updatePositionInput: UpdatePositionInput) {
    return this.positionService.update(updatePositionInput);
  }

  @Mutation({ input: positionSchema.pick({ id: true }) })
  async delete(@Input() input: { id: string }) {
    return this.positionService.delete(input.id);
  }

  @Query({ input: positionSchema.pick({ id: true }), output: positionSchema })
  async getPositionById(@Input() input: { id: string }) {
    return this.positionService.findById(input.id);
  }

  @Query({ input: positionListInputSchema, output: positionListOutputSchema })
  async getPositions(@Input() input: PositionListInput) {
    return this.positionService.findAll(input);
  }
}
