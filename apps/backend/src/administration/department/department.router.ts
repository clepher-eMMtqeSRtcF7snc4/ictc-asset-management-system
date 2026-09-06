import { DepartmentService } from './department.service';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import {
  createDepartmentInputSchema,
  updateDepartmentInputSchema,
  departmentListInputSchema,
  departmentListOutputSchema,
  departmentSchema,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentListInput,
  activeDepartmentListOutputSchema,
} from '@repo/trpc/schemas';
import { AuthTrpcMiddleware } from '../../auth/auth-trpc.middleware';
import { AppContext } from '../../app.context.interface';
import { RbacService } from '../rbac/authorization/rbac.service';
import { ForbiddenException } from '@nestjs/common';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class DepartmentRouter {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly rbacService: RbacService,
  ) {}

  @Mutation({ input: createDepartmentInputSchema })
  async create(
    @Input() createDepartmentInput: CreateDepartmentInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'department.manage');
    return this.departmentService.create(createDepartmentInput);
  }

  @Mutation({ input: updateDepartmentInputSchema })
  async update(
    @Input() updateDepartmentInput: UpdateDepartmentInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'department.manage');
    return this.departmentService.update(updateDepartmentInput);
  }

  @Mutation({ input: departmentSchema.pick({ id: true }) })
  async delete(@Input() input: { id: number }, @Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'department.manage');
    return this.departmentService.delete(input.id);
  }

  @Query({
    input: departmentSchema.pick({ id: true }),
    output: departmentSchema,
  })
  async getDepartmentById(
    @Input() input: { id: number },
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'department.read');
    return this.departmentService.findById(input.id);
  }

  @Query({
    input: departmentListInputSchema,
    output: departmentListOutputSchema,
  })
  async getDepartments(
    @Input() input: DepartmentListInput,
    @Ctx() ctx: AppContext,
  ) {
    await this.checkPermission(ctx, 'department.read');
    return this.departmentService.findAll(input);
  }

  @Query({
    output: activeDepartmentListOutputSchema,
  })
  async getActiveDepartments(@Ctx() ctx: AppContext) {
    await this.checkPermission(ctx, 'department.read');
    return this.departmentService.findActive();
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
