import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

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
      employee: z.object({
        firstName: z.string().min(1, "First name is required"),
        middleName: z.string().nullable(),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Enter a valid email address"),
        position: z.string().min(1, "Position is required"),
        designation: z.string().min(1, "Designation is required"),
        departmentId: z.number().int().positive(),
        role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
        status: z.enum([
          'active',
          'inactive',
          'retire',
        ]),
        photo: z.string().nullable(),
      }).extend({
        id: z.number().int().positive(),
        status: z.enum([
          'active',
          'inactive',
          'retire',
        ]),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
      }).optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  buildingRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      status: z.enum(["active", "inactive"]),
      description: z.string().trim().max(500).optional().nullable(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      status: z.enum(["active", "inactive"]),
      description: z.string().trim().max(500).optional().nullable(),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ name, code, description }) =>
        name !== undefined ||
        code !== undefined ||
        description !== undefined ||
        { message: "Provide at least one field to update" },
    )).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      id: z.number().int().positive(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getBuildingById: publicProcedure.input(z.object({
      id: z.number().int().positive(),
    })).output(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      status: z.enum(["active", "inactive"]),
      description: z.string().trim().max(500).optional().nullable(),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getBuildings: publicProcedure.input(z
      .object({
        search: z.string().trim().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          name: z.string().trim().min(1, "This field is required").max(150),
          code: z
            .string()
            .trim()
            .min(1, "This field is required")
            .max(50)
            .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
          status: z.enum(["active", "inactive"]),
          description: z.string().trim().max(500).optional().nullable(),
        }).extend({
          id: z.number().int().positive(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  roomRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z.string().trim().max(50).optional().nullable(),
      roomTypeId: z.number().int().positive(),
      buildingId: z.number().int().positive(),
      floor: z.enum(['1st floor', '2nd floor', '3rd floor', '4th floor']),
      departmentId: z.number().int().positive().nullable(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, 'This field is required').max(150),
      code: z.string().trim().max(50).optional().nullable(),
      roomTypeId: z.number().int().positive(),
      buildingId: z.number().int().positive(),
      floor: z.enum(['1st floor', '2nd floor', '3rd floor', '4th floor']),
      departmentId: z.number().int().positive().nullable(),
    }).partial().extend({
      id: z.number().int().positive(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      name: z.string(),
      code: z.string().optional().nullable(),
      roomTypeId: z.number().int().positive(),
      buildingId: z.number().int().positive(),
      floor: z.enum(["1st floor", "2nd floor", "3rd floor", "4th floor"]),
      departmentId: z.number().int().positive().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(["active", "inactive"]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getRoomById: publicProcedure.input(z.object({
      id: z.number().int().positive(),
    })).output(z.object({
      name: z.string(),
      code: z.string().optional().nullable(),
      roomTypeId: z.number().int().positive(),
      buildingId: z.number().int().positive(),
      floor: z.enum(["1st floor", "2nd floor", "3rd floor", "4th floor"]),
      departmentId: z.number().int().positive().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(["active", "inactive"]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getRooms: publicProcedure.input(z
      .object({
        buildingId: z.number().int().positive().optional(),
        search: z.string().trim().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        floor: z.enum(["1st floor", "2nd floor", "3rd floor", "4th floor"]).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          name: z.string(),
          code: z.string().optional().nullable(),
          roomTypeId: z.number().int().positive(),
          buildingId: z.number().int().positive(),
          floor: z.enum(["1st floor", "2nd floor", "3rd floor", "4th floor"]),
          departmentId: z.number().int().positive().nullable(),
        }).extend({
          id: z.number().int().positive(),
          status: z.enum(["active", "inactive"]),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  roomTypeRouter: t.router({
    create: publicProcedure.input(z.object({
      code: z.string().optional().nullable(),
      name: z.string().min(1, "This field is required")
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      code: z.string().optional().nullable(),
      name: z.string().min(1, "This field is required")
    }).partial().extend({
      id: z.number().int().positive()
    }).refine(({ code, name }) =>
      name !== undefined ||
      code !== undefined ||
      { message: "Provide at least one field to update" }
    )).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      code: z.string().optional().nullable(),
      name: z.string().min(1, "This field is required")
    }).extend({
      id: z.number().int().positive()
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getRoomTypeById: publicProcedure.input(z.object({
      code: z.string().optional().nullable(),
      name: z.string().min(1, "This field is required")
    }).extend({
      id: z.number().int().positive()
    }).pick({ id: true })).output(z.object({
      code: z.string().optional().nullable(),
      name: z.string().min(1, "This field is required")
    }).extend({
      id: z.number().int().positive()
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getRoomTypes: publicProcedure.input(z
      .object({
        search: z.string().trim().optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          code: z.string().optional().nullable(),
          name: z.string().min(1, "This field is required")
        }).extend({
          id: z.number().int().positive()
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  departmentRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      supervisor: z.string().trim().optional().nullable(),
      custodian: z.string().trim().optional().nullable(),
      logo: z.string().nullable(),
      color: z.string().trim().nullable()
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      supervisor: z.string().trim().optional().nullable(),
      custodian: z.string().trim().optional().nullable(),
      logo: z.string().nullable(),
      color: z.string().trim().nullable()
    }).extend({
      status: z.enum(["active", "inactive"]).optional(),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ name, code, description, supervisor, status }) =>
        name !== undefined ||
        code !== undefined ||
        description !== undefined ||
        supervisor !== undefined ||
        status !== undefined,
      { message: "Provide at least one field to update" },
    )).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      supervisor: z.string().trim().optional().nullable(),
      custodian: z.string().trim().optional().nullable(),
      logo: z.string().nullable(),
      color: z.string().trim().nullable()
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(["active", "inactive"]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getDepartmentById: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      supervisor: z.string().trim().optional().nullable(),
      custodian: z.string().trim().optional().nullable(),
      logo: z.string().nullable(),
      color: z.string().trim().nullable()
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(["active", "inactive"]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }).pick({ id: true })).output(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      supervisor: z.string().trim().optional().nullable(),
      custodian: z.string().trim().optional().nullable(),
      logo: z.string().nullable(),
      color: z.string().trim().nullable()
    }).extend({
      id: z.number().int().positive(),
      status: z.enum(["active", "inactive"]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getDepartments: publicProcedure.input(z
      .object({
        search: z.string().trim().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          name: z.string().trim().min(1, "This field is required").max(150),
          code: z
            .string()
            .trim()
            .min(1, "This field is required")
            .max(50)
            .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
          description: z.string().trim().max(500).optional().nullable(),
          supervisor: z.string().trim().optional().nullable(),
          custodian: z.string().trim().optional().nullable(),
          logo: z.string().nullable(),
          color: z.string().trim().nullable()
        }).extend({
          id: z.number().int().positive(),
          status: z.enum(["active", "inactive"]),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  employeeRouter: t.router({
    create: publicProcedure.input(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive(),
      role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      photo: z.string().nullable(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive(),
      role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      photo: z.string().nullable(),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ firstName, lastName, email, position, designation, departmentId, status, role }) =>
        firstName !== undefined ||
        lastName !== undefined ||
        email !== undefined ||
        position !== undefined ||
        designation !== undefined ||
        departmentId !== undefined ||
        status !== undefined ||
        role !== undefined,
      { message: "Provide at least one field to update" },
    )).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive(),
      role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      photo: z.string().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getEmployeeById: publicProcedure.input(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive(),
      role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      photo: z.string().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }).pick({ id: true })).output(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive(),
      role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      photo: z.string().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum([
        'active',
        'inactive',
        'retire',
      ]),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getEmployees: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        departmentId: z.number().int().positive().optional(),
        position: z.string().trim().min(1).max(150).optional(),
        designation: z.string().trim().min(1).max(150).optional(),
        status: z.enum([
          'active',
          'inactive',
          'retire',
        ]).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          firstName: z.string().min(1, "First name is required"),
          middleName: z.string().nullable(),
          lastName: z.string().min(1, "Last name is required"),
          email: z.string().email("Enter a valid email address"),
          position: z.string().min(1, "Position is required"),
          designation: z.string().min(1, "Designation is required"),
          departmentId: z.number().int().positive(),
          role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
          status: z.enum([
            'active',
            'inactive',
            'retire',
          ]),
          photo: z.string().nullable(),
        }).extend({
          id: z.number().int().positive(),
          status: z.enum([
            'active',
            'inactive',
            'retire',
          ]),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

