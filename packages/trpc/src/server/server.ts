import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;
const optionalText = (max: number) =>
  z.string().trim().min(1).max(max).optional().nullable();

const appRouter = t.router({
  usersRouter: t.router({
    updateProfile: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(50, "Maximum 50 characters"),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUserProfile: publicProcedure.input(z.object({
      userId: z.string(),
    })).output(z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  departmentsRouter: t.router({
    list: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum(['active', 'inactive']).optional(),
        type: z.string().trim().min(1).max(100).optional(),
      })
      .default({})).output(z.array(z.object({
        name: z.string().trim().min(1, 'This field is required').max(150),
        code: z
          .string()
          .trim()
          .min(1, 'This field is required')
          .max(50)
          .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
        type: z.string().trim().min(1, 'This field is required').max(100),
      }).extend({
        id: z.number().int().positive(),
        status: z.enum(['active', 'inactive']),
      }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    })).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ name, code, type }) =>
        name !== undefined || code !== undefined || type !== undefined,
      { message: 'Provide at least one field to update' },
    )).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    setStatus: publicProcedure.input(z.object({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  locationsRouter: t.router({
    list: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum(['active', 'inactive']).optional(),
        type: z.string().trim().min(1).max(100).optional(),
      })
      .default({})).output(z.array(z.object({
        name: z.string().trim().min(1, 'This field is required').max(150),
        code: z
          .string()
          .trim()
          .min(1, 'This field is required')
          .max(50)
          .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
        type: z.string().trim().min(1, 'This field is required').max(100),
      }).extend({
        id: z.number().int().positive(),
        status: z.enum(['active', 'inactive']),
      }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    })).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ name, code, type }) =>
        name !== undefined || code !== undefined || type !== undefined,
      { message: 'Provide at least one field to update' },
    )).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    setStatus: publicProcedure.input(z.object({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  categoriesRouter: t.router({
    list: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum(['active', 'inactive']).optional(),
        type: z.string().trim().min(1).max(100).optional(),
      })
      .default({})).output(z.array(z.object({
        name: z.string().trim().min(1, 'This field is required').max(150),
        code: z
          .string()
          .trim()
          .min(1, 'This field is required')
          .max(50)
          .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
        type: z.string().trim().min(1, 'This field is required').max(100),
      }).extend({
        id: z.number().int().positive(),
        status: z.enum(['active', 'inactive']),
      }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    })).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ name, code, type }) =>
        name !== undefined || code !== undefined || type !== undefined,
      { message: 'Provide at least one field to update' },
    )).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    setStatus: publicProcedure.input(z.object({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
      type: z.string().trim().min(1, 'This field is required').max(100),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(['active', 'inactive']),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  userManagementRouter: t.router({
    listUsers: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum([
          'active',
          'inactive',
          'suspended',
        ]).optional(),
        departmentId: z.number().int().positive().optional(),
      })
      .default({})).output(z.array(z.object({
        id: z.string(),
        firstName: z.string(),
        middleName: z.string().nullable(),
        lastName: z.string(),
        email: z.string().email(),
        position: z.string(),
        designation: z.string(),
        office: z.string(),
        departmentId: z.number().int().positive().nullable(),
        departmentName: z.string().nullable(),
        roleId: z.string().nullable(),
        roleName: z.string().nullable(),
        status: z.enum([
          'active',
          'inactive',
          'suspended',
        ]),
        profilePicture: z.string().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUserSummary: publicProcedure.output(z.object({
      totalUsers: z.number().int().nonnegative(),
      activeUsers: z.number().int().nonnegative(),
      inactiveUsers: z.number().int().nonnegative(),
      suspendedUsers: z.number().int().nonnegative(),
      totalRoles: z.number().int().nonnegative(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createUser: publicProcedure.input(z.object({
      firstName: z.string().trim().min(1, 'This field is required').max(100),
      middleName: z.string().trim().min(1, 'This field is required').max(100).optional().nullable(),
      lastName: z.string().trim().min(1, 'This field is required').max(100),
      position: z.string().trim().min(1).max(150),
      designation: z.string().trim().min(1).max(150),
      office: z.string().trim().min(1).max(150),
      departmentId: z.number().int().positive(),
      email: z.string().trim().email().max(320),
      roleId: z.string().trim().min(1).max(100),
      status: z.enum([
        'active',
        'inactive',
        'suspended',
      ]).default('active'),
      profilePicture: z.string().trim().url().max(2048).optional().nullable(),
    }).extend({
      userId: z.string().trim().min(1).max(100).optional(),
    })).output(z.object({
      id: z.string(),
      firstName: z.string(),
      middleName: z.string().nullable(),
      lastName: z.string(),
      email: z.string().email(),
      position: z.string(),
      designation: z.string(),
      office: z.string(),
      departmentId: z.number().int().positive().nullable(),
      departmentName: z.string().nullable(),
      roleId: z.string().nullable(),
      roleName: z.string().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'suspended',
      ]),
      profilePicture: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateUser: publicProcedure.input(z.object({
      firstName: z.string().trim().min(1, 'This field is required').max(100),
      middleName: z.string().trim().min(1, 'This field is required').max(100).optional().nullable(),
      lastName: z.string().trim().min(1, 'This field is required').max(100),
      position: z.string().trim().min(1).max(150),
      designation: z.string().trim().min(1).max(150),
      office: z.string().trim().min(1).max(150),
      departmentId: z.number().int().positive(),
      email: z.string().trim().email().max(320),
      roleId: z.string().trim().min(1).max(100),
      status: z.enum([
        'active',
        'inactive',
        'suspended',
      ]).default('active'),
      profilePicture: z.string().trim().url().max(2048).optional().nullable(),
    }).partial().extend({
      id: z.string().trim().min(1).max(100),
    }).refine(
      ({ id: _id, ...updates }) => Object.values(updates).some((value) => value !== undefined),
      { message: 'Provide at least one field to update' },
    )).output(z.object({
      id: z.string(),
      firstName: z.string(),
      middleName: z.string().nullable(),
      lastName: z.string(),
      email: z.string().email(),
      position: z.string(),
      designation: z.string(),
      office: z.string(),
      departmentId: z.number().int().positive().nullable(),
      departmentName: z.string().nullable(),
      roleId: z.string().nullable(),
      roleName: z.string().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'suspended',
      ]),
      profilePicture: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    setUserStatus: publicProcedure.input(z.object({
      id: z.string().trim().min(1).max(100),
      status: z.enum([
        'active',
        'inactive',
        'suspended',
      ]),
    })).output(z.object({
      id: z.string(),
      firstName: z.string(),
      middleName: z.string().nullable(),
      lastName: z.string(),
      email: z.string().email(),
      position: z.string(),
      designation: z.string(),
      office: z.string(),
      departmentId: z.number().int().positive().nullable(),
      departmentName: z.string().nullable(),
      roleId: z.string().nullable(),
      roleName: z.string().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'suspended',
      ]),
      profilePicture: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    listRoles: publicProcedure.output(z.array(z.object({
      name: z.string().trim().min(1, 'This field is required').max(100),
      description: z.string().trim().max(500).optional().nullable(),
      permissions: z.array(z.string().trim().min(1).max(150)).max(200),
    }).extend({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createRole: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(100),
      description: z.string().trim().max(500).optional().nullable(),
      permissions: z.array(z.string().trim().min(1).max(150)).max(200),
    })).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(100),
      description: z.string().trim().max(500).optional().nullable(),
      permissions: z.array(z.string().trim().min(1).max(150)).max(200),
    }).extend({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateRole: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(100),
      description: z.string().trim().max(500).optional().nullable(),
      permissions: z.array(z.string().trim().min(1).max(150)).max(200),
    }).partial().extend({
      id: z.string().trim().min(1).max(100),
    }).refine(
      ({ id: _id, ...updates }) => Object.values(updates).some((value) => value !== undefined),
      { message: 'Provide at least one field to update' },
    )).output(z.object({
      name: z.string().trim().min(1, 'This field is required').max(100),
      description: z.string().trim().max(500).optional().nullable(),
      permissions: z.array(z.string().trim().min(1).max(150)).max(200),
    }).extend({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    listAuditLogs: publicProcedure.input(z
      .object({
        userId: z.string().trim().min(1).max(100).optional(),
        action: z.string().trim().min(1).max(100).optional(),
        limit: z.number().int().min(1).max(200).default(50),
      })
      .default({ limit: 50 })).output(z.array(z.object({
        id: z.string(),
        actorUserId: z.string().nullable(),
        actorName: z.string().nullable(),
        userId: z.string().nullable(),
        userName: z.string().nullable(),
        action: z.string(),
        entityType: z.string(),
        entityId: z.string(),
        metadata: z.record(z.string(), z.unknown()),
        createdAt: z.date(),
      }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  assetsRouter: t.router({
    previewRegistrationIdentifiers: publicProcedure.input(z.object({
      categoryId: z.number().int().positive(),
    })).output(z.object({
      assetTag: z.string(),
      propertyNumber: z.string(),
      qrValue: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    register: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(200),
      assetType: z.string().trim().min(1, 'This field is required').max(100),
      categoryId: z.number().int().positive(),
      departmentId: z.number().int().positive().optional().nullable(),
      locationId: z.number().int().positive().optional().nullable(),
      custodianId: z.string().trim().min(1).max(100).optional().nullable(),
      brand: z.string().trim().min(1, 'This field is required').max(100),
      model: z.string().trim().min(1, 'This field is required').max(100),
      description: optionalText(5_000),
      condition: z.string().trim().min(1, 'This field is required').max(100),
      serialNumber: optionalText(200),
      barcode: optionalText(200),
      partNumber: optionalText(200),
      acquisitionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
      purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional().nullable(),
      acquisitionCost: z.number().finite().nonnegative(),
      supplier: optionalText(200),
      reference: optionalText(200),
      fundingSource: optionalText(200),
      warrantyStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional().nullable(),
      warrantyEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional().nullable(),
      usefulLife: z.number().int().positive().optional().nullable(),
      residualValue: z.number().finite().nonnegative().optional().nullable(),
      depreciationMethod: optionalText(100),
      imageUrl: z.string().trim().url().max(2_048).optional().nullable(),
    }).extend({
      status: z.enum(['draft', 'available', 'assigned']).default('available'),
    })).output(z.object({
      id: z.number().int().positive(),
      name: z.string().nullable(),
      assetType: z.string().nullable(),
      categoryId: z.number().int().positive(),
      departmentId: z.number().int().positive().nullable(),
      locationId: z.number().int().positive().nullable(),
      custodianId: z.string().nullable(),
      brand: z.string().nullable(),
      model: z.string().nullable(),
      description: z.string().nullable(),
      condition: z.string().nullable(),
      serialNumber: z.string().nullable(),
      barcode: z.string().nullable(),
      partNumber: z.string().nullable(),
      acquisitionDate: z.string().nullable(),
      purchaseDate: z.string().nullable(),
      acquisitionCost: z.number().nullable(),
      supplier: z.string().nullable(),
      reference: z.string().nullable(),
      fundingSource: z.string().nullable(),
      warrantyStartDate: z.string().nullable(),
      warrantyEndDate: z.string().nullable(),
      usefulLife: z.number().int().positive().nullable(),
      residualValue: z.number().nullable(),
      depreciationMethod: z.string().nullable(),
      imageUrl: z.string().nullable(),
      assetTag: z.string(),
      propertyNumber: z.string(),
      qrValue: z.string(),
      status: z.enum(['draft', 'available', 'assigned']),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    saveDraft: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(200),
      assetType: z.string().trim().min(1, 'This field is required').max(100),
      categoryId: z.number().int().positive(),
      departmentId: z.number().int().positive().optional().nullable(),
      locationId: z.number().int().positive().optional().nullable(),
      custodianId: z.string().trim().min(1).max(100).optional().nullable(),
      brand: z.string().trim().min(1, 'This field is required').max(100),
      model: z.string().trim().min(1, 'This field is required').max(100),
      description: optionalText(5_000),
      condition: z.string().trim().min(1, 'This field is required').max(100),
      serialNumber: optionalText(200),
      barcode: optionalText(200),
      partNumber: optionalText(200),
      acquisitionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
      purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional().nullable(),
      acquisitionCost: z.number().finite().nonnegative(),
      supplier: optionalText(200),
      reference: optionalText(200),
      fundingSource: optionalText(200),
      warrantyStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional().nullable(),
      warrantyEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional().nullable(),
      usefulLife: z.number().int().positive().optional().nullable(),
      residualValue: z.number().finite().nonnegative().optional().nullable(),
      depreciationMethod: optionalText(100),
      imageUrl: z.string().trim().url().max(2_048).optional().nullable(),
    }).partial().extend({
      categoryId: z.number().int().positive(),
    })).output(z.object({
      id: z.number().int().positive(),
      name: z.string().nullable(),
      assetType: z.string().nullable(),
      categoryId: z.number().int().positive(),
      departmentId: z.number().int().positive().nullable(),
      locationId: z.number().int().positive().nullable(),
      custodianId: z.string().nullable(),
      brand: z.string().nullable(),
      model: z.string().nullable(),
      description: z.string().nullable(),
      condition: z.string().nullable(),
      serialNumber: z.string().nullable(),
      barcode: z.string().nullable(),
      partNumber: z.string().nullable(),
      acquisitionDate: z.string().nullable(),
      purchaseDate: z.string().nullable(),
      acquisitionCost: z.number().nullable(),
      supplier: z.string().nullable(),
      reference: z.string().nullable(),
      fundingSource: z.string().nullable(),
      warrantyStartDate: z.string().nullable(),
      warrantyEndDate: z.string().nullable(),
      usefulLife: z.number().int().positive().nullable(),
      residualValue: z.number().nullable(),
      depreciationMethod: z.string().nullable(),
      imageUrl: z.string().nullable(),
      assetTag: z.string(),
      propertyNumber: z.string(),
      qrValue: z.string(),
      status: z.enum(['draft', 'available', 'assigned']),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;
