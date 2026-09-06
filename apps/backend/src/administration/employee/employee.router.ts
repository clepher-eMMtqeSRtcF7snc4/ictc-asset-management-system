import { EmployeeService } from './employee.service';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  createEmployeeInputSchema,
  updateEmployeeInputSchema,
  employeeSchema,
  employeeListInputSchema,
  employeeListOutputSchema,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeListInput,
  activeEmployeeListOutputSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { AppContext } from '../../app.context.interface';
import { RbacService } from '../rbac/authorization/rbac.service';
import { ForbiddenException } from '@nestjs/common';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class EmployeeRouter {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly rbacService: RbacService,
  ) {}

  @Mutation({ input: createEmployeeInputSchema })
  async create(
    @Input() createEmployeeInput: CreateEmployeeInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'employee.create');
    return this.employeeService.create(createEmployeeInput);
  }

  @Mutation({ input: updateEmployeeInputSchema })
  async update(
    @Input() updateEmployeeInput: UpdateEmployeeInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'employee.update');
    return this.employeeService.update(updateEmployeeInput);
  }

  @Mutation({ input: employeeSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'employee.delete');
    return this.employeeService.delete(input.id);
  }

  @Query({ input: employeeSchema.pick({ id: true }), output: employeeSchema })
  async getEmployeeById(
    @Input() input: { id: number },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'employee.read');
    return this.employeeService.findById(input.id);
  }

  @Query({ input: employeeListInputSchema, output: employeeListOutputSchema })
  async getEmployees(
    @Input() input: EmployeeListInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'employee.read');
    return this.employeeService.findAll(input);
  }

  @Query({
    input: z
      .object({
        departmentId: z.number().int().positive().optional(),
      })
      .default({}),
    output: activeEmployeeListOutputSchema,
  })
  async getActiveEmployees(
    @Input() input: { departmentId?: number } = {},
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'employee.read');
    return this.employeeService.findActive(input);
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
