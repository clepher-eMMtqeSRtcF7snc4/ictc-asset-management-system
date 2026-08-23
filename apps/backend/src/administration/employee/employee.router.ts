import { EmployeeService } from './employee.service';
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  createEmployeeInputSchema,
  updateEmployeeInputSchema,
  employeeSchema,
  employeeListInputSchema,
  employeeListOutputSchema,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeListInput,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class EmployeeRouter {
  constructor(private readonly employeeService: EmployeeService) {}

  @Mutation({ input: createEmployeeInputSchema })
  async create(@Input() createEmployeeInput: CreateEmployeeInput) {
    return this.employeeService.create(createEmployeeInput);
  }

  @Mutation({ input: updateEmployeeInputSchema })
  async update(@Input() updateEmployeeInput: UpdateEmployeeInput) {
    return this.employeeService.update(updateEmployeeInput);
  }

  @Mutation({ input: employeeSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }) {
    return this.employeeService.delete(input.id);
  }

  @Query({ input: employeeSchema.pick({ id: true }), output: employeeSchema })
  async getEmployeeById(@Input() input: { id: number }) {
    return this.employeeService.findById(input.id);
  }

  @Query({ input: employeeListInputSchema, output: employeeListOutputSchema })
  async getEmployees(@Input() input: EmployeeListInput) {
    return this.employeeService.findAll(input);
  }
}
