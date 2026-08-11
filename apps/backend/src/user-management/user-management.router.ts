import { Ctx, Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc-v2';
import {
  auditLogListInputSchema,
  auditLogSchema,
  createRoleSchema,
  createUserSchema,
  roleSchema,
  setUserStatusSchema,
  updateRoleSchema,
  updateUserSchema,
  userManagementListInputSchema,
  userManagementSummarySchema,
  userManagementUserSchema,
  type AuditLogListInput,
  type CreateRoleInput,
  type CreateUserInput,
  type SetUserStatusInput,
  type UpdateRoleInput,
  type UpdateUserInput,
  type UserManagementListInput,
} from '@repo/trpc/schemas';
import { z } from 'zod';
import { AppContext } from '../app.context.interface';
import { AuthTrpcMiddleware } from '../auth/auth-trpc.middleware';
import { UserManagementService } from './user-management.service';

@Router({ alias: 'userManagementRouter' })
@UseMiddlewares(AuthTrpcMiddleware)
export class UserManagementRouter {
  constructor(
    private readonly userManagementService: UserManagementService,
  ) {}

  @Query({
    input: userManagementListInputSchema,
    output: z.array(userManagementUserSchema),
  })
  async listUsers(@Input() input: UserManagementListInput) {
    return this.userManagementService.listUsers(input);
  }

  @Query({ output: userManagementSummarySchema })
  async getUserSummary() {
    return this.userManagementService.getUserSummary();
  }

  @Mutation({ input: createUserSchema, output: userManagementUserSchema })
  async createUser(
    @Input() input: CreateUserInput,
    @Ctx() context: AppContext,
  ) {
    return this.userManagementService.createUser(input, context.user.id);
  }

  @Mutation({ input: updateUserSchema, output: userManagementUserSchema })
  async updateUser(
    @Input() input: UpdateUserInput,
    @Ctx() context: AppContext,
  ) {
    return this.userManagementService.updateUser(input, context.user.id);
  }

  @Mutation({ input: setUserStatusSchema, output: userManagementUserSchema })
  async setUserStatus(
    @Input() input: SetUserStatusInput,
    @Ctx() context: AppContext,
  ) {
    return this.userManagementService.setUserStatus(input, context.user.id);
  }

  @Query({ output: z.array(roleSchema) })
  async listRoles() {
    return this.userManagementService.listRoles();
  }

  @Mutation({ input: createRoleSchema, output: roleSchema })
  async createRole(
    @Input() input: CreateRoleInput,
    @Ctx() context: AppContext,
  ) {
    return this.userManagementService.createRole(input, context.user.id);
  }

  @Mutation({ input: updateRoleSchema, output: roleSchema })
  async updateRole(
    @Input() input: UpdateRoleInput,
    @Ctx() context: AppContext,
  ) {
    return this.userManagementService.updateRole(input, context.user.id);
  }

  @Query({ input: auditLogListInputSchema, output: z.array(auditLogSchema) })
  async listAuditLogs(@Input() input: AuditLogListInput) {
    return this.userManagementService.listAuditLogs(input);
  }
}
