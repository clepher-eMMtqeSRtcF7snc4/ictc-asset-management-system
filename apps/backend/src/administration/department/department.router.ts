import { DepartmentService } from './department.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  createDepartmentInputSchema,
  updateDepartmentInputSchema,
  departmentListInputSchema,
  departmentListOutputSchema,
  departmentSchema,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentListInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class DepartmentRouter {
  constructor(private readonly departmentService: DepartmentService) {}

  @Mutation({ input: createDepartmentInputSchema })
  async create(@Input() createDepartmentInput: CreateDepartmentInput) {
    return this.departmentService.create(createDepartmentInput);
  }

  @Mutation({ input: updateDepartmentInputSchema })
  async update(@Input() updateDepartmentInput: UpdateDepartmentInput) {
    return this.departmentService.update(updateDepartmentInput);
  }

  @Mutation({ input: departmentSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.departmentService.delete(input.id);
  }

  @Query({
    input: departmentSchema.pick({ id: true }),
    output: departmentSchema,
  })
  async getDepartmentById(@Input() input: { id: number }) {
    return this.departmentService.findById(input.id);
  }

  @Query({
    input: departmentListInputSchema,
    output: departmentListOutputSchema,
  })
  async getDepartments(@Input() input: DepartmentListInput) {
    return this.departmentService.findAll(input);
  }
}
