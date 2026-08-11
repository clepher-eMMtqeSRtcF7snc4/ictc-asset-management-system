import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  createDepartmentInputSchema,
  departmentListInputSchema,
  departmentListOutputSchema,
  departmentSchema,
  setDepartmentStatusInputSchema,
  updateDepartmentInputSchema,
  type CreateDepartmentInput,
  type DepartmentListInput,
  type SetDepartmentStatusInput,
  type UpdateDepartmentInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { DepartmentsService } from './departments.service';

@Router({ alias: 'departmentsRouter' })
@UseMiddlewares(AuthTrpcMiddleware)
export class DepartmentsRouter {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Query({ input: departmentListInputSchema, output: departmentListOutputSchema })
  async list(@Input() input: DepartmentListInput) {
    return this.departmentsService.list(input);
  }

  @Mutation({ input: createDepartmentInputSchema, output: departmentSchema })
  async create(@Input() input: CreateDepartmentInput) {
    return this.departmentsService.create(input);
  }

  @Mutation({ input: updateDepartmentInputSchema, output: departmentSchema })
  async update(@Input() input: UpdateDepartmentInput) {
    return this.departmentsService.update(input);
  }

  @Mutation({ input: setDepartmentStatusInputSchema, output: departmentSchema })
  async setStatus(@Input() input: SetDepartmentStatusInput) {
    return this.departmentsService.setStatus(input);
  }
}
