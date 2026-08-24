import { DesignationService } from './designation.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  createDesignationInputSchema,
  updateDesignationInputSchema,
  designationSchema,
  designationListInputSchema,
  designationListOutputSchema,
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationListInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class DesignationRouter {
  constructor(private readonly designationService: DesignationService) {}

  @Mutation({ input: createDesignationInputSchema })
  async create(@Input() createDesignationInput: CreateDesignationInput) {
    return this.designationService.create(createDesignationInput);
  }

  @Mutation({ input: updateDesignationInputSchema })
  async update(@Input() updateDesignationInput: UpdateDesignationInput) {
    return this.designationService.update(updateDesignationInput);
  }

  @Mutation({ input: designationSchema.pick({ id: true }) })
  async delete(@Input() input: { id: string }) {
    return this.designationService.delete(input.id);
  }

  @Query({
    input: designationSchema.pick({ id: true }),
    output: designationSchema,
  })
  async getDesignationById(@Input() input: { id: string }) {
    return this.designationService.findById(input.id);
  }

  @Query({
    input: designationListInputSchema,
    output: designationListOutputSchema,
  })
  async getDesignations(@Input() input: DesignationListInput) {
    return this.designationService.findAll(input);
  }
}
