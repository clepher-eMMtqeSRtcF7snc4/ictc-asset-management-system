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
        departmentId: z.number().int().positive("Department is required"),
        status: z.enum([
          'active',
          'casual',
          'contractual',
          'deceased',
          'end-of-contract',
          'inactive',
          'job-order',
          'on-leave',
          'permanent',
          'probationary',
          'retired',
          'regular',
          'suspended',
          'temporary',
          'terminated',
        ] as const),
        photo: z.string().nullable(),
      }).extend({
        id: z.number().int().positive(),
        status: z.enum([
          'active',
          'casual',
          'contractual',
          'deceased',
          'end-of-contract',
          'inactive',
          'job-order',
          'on-leave',
          'permanent',
          'probationary',
          'retired',
          'regular',
          'suspended',
          'temporary',
          'terminated',
        ] as const),
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
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveBuildings: publicProcedure.output(z.array(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(1, "This field is required").max(150),
      }),
    )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
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
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveRooms: publicProcedure.input(z
      .object({
        buildingId: z.number().int().positive().optional(),
      })
      .default({})).output(z.array(
        z.object({
          id: z.number().int().positive(),
          name: z.string().trim().min(1, "This field is required").max(150),
        }),
      )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getRoomCountsByBuilding: publicProcedure.input(z.object({})).output(z.record(z.string(), z.number().int().nonnegative())).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
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
      supervisorId: z.number().int().positive().optional().nullable(),
      custodianId: z.number().int().positive().optional().nullable(),
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
      supervisorId: z.number().int().positive().optional().nullable(),
      custodianId: z.number().int().positive().optional().nullable(),
      logo: z.string().nullable(),
      color: z.string().trim().nullable()
    }).extend({
      status: z.enum(["active", "inactive"]).optional(),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ name, code, description, supervisorId, custodianId, status }) =>
        name !== undefined ||
        code !== undefined ||
        description !== undefined ||
        supervisorId !== undefined ||
        custodianId !== undefined ||
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
      supervisorId: z.number().int().positive().optional().nullable(),
      custodianId: z.number().int().positive().optional().nullable(),
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
      supervisorId: z.number().int().positive().optional().nullable(),
      custodianId: z.number().int().positive().optional().nullable(),
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
      supervisorId: z.number().int().positive().optional().nullable(),
      custodianId: z.number().int().positive().optional().nullable(),
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
          supervisorId: z.number().int().positive().optional().nullable(),
          custodianId: z.number().int().positive().optional().nullable(),
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
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveDepartments: publicProcedure.output(z.array(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(1, "This field is required").max(150),
        code: z.string().trim().min(1, "This field is required").max(50),
      }),
    )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  employeeRouter: t.router({
    create: publicProcedure.input(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive("Department is required"),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
      photo: z.string().nullable(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive("Department is required"),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
      photo: z.string().nullable(),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ firstName, lastName, email, position, designation, departmentId, status, photo }) =>
        firstName !== undefined ||
        lastName !== undefined ||
        email !== undefined ||
        position !== undefined ||
        designation !== undefined ||
        departmentId !== undefined ||
        status !== undefined ||
        photo !== undefined,
      { message: "Provide at least one field to update" },
    )).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive("Department is required"),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
      photo: z.string().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
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
      departmentId: z.number().int().positive("Department is required"),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
      photo: z.string().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    }).pick({ id: true })).output(z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().nullable(),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Enter a valid email address"),
      position: z.string().min(1, "Position is required"),
      designation: z.string().min(1, "Designation is required"),
      departmentId: z.number().int().positive("Department is required"),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
      photo: z.string().nullable(),
    }).extend({
      id: z.number().int().positive(),
      status: z.enum([
        'active',
        'casual',
        'contractual',
        'deceased',
        'end-of-contract',
        'inactive',
        'job-order',
        'on-leave',
        'permanent',
        'probationary',
        'retired',
        'regular',
        'suspended',
        'temporary',
        'terminated',
      ] as const),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getEmployees: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        departmentId: z.number().int().positive().optional(),
        positionId: z.string().trim().min(1).max(150).optional(),
        designationId: z.string().trim().min(1).max(150).optional(),
        status: z.enum([
          'active',
          'casual',
          'contractual',
          'deceased',
          'end-of-contract',
          'inactive',
          'job-order',
          'on-leave',
          'permanent',
          'probationary',
          'retired',
          'regular',
          'suspended',
          'temporary',
          'terminated',
        ] as const).optional(),
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
          departmentId: z.number().int().positive("Department is required"),
          status: z.enum([
            'active',
            'casual',
            'contractual',
            'deceased',
            'end-of-contract',
            'inactive',
            'job-order',
            'on-leave',
            'permanent',
            'probationary',
            'retired',
            'regular',
            'suspended',
            'temporary',
            'terminated',
          ] as const),
          photo: z.string().nullable(),
        }).extend({
          id: z.number().int().positive(),
          status: z.enum([
            'active',
            'casual',
            'contractual',
            'deceased',
            'end-of-contract',
            'inactive',
            'job-order',
            'on-leave',
            'permanent',
            'probationary',
            'retired',
            'regular',
            'suspended',
            'temporary',
            'terminated',
          ] as const),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveEmployees: publicProcedure.input(z
      .object({
        departmentId: z.number().int().positive().optional(),
      })
      .default({})).output(z.array(
        z.object({
          id: z.number().int().positive(),
          name: z.string().trim().min(1, "Name is required").max(200),
        }),
      )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  positionRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().min(1, "Position name is required"),
      status: z.enum(["active", "inactive"]),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().min(1, "Position name is required"),
      status: z.enum(["active", "inactive"]),
    }).partial().extend({
      id: z.string().min(1, "ID is required"),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      id: z.string(),
      name: z.string().min(1, "Name is required"),
      status: z.enum(["active", "inactive"]),
      employeeCount: z.number().int().nonnegative(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getPositionById: publicProcedure.input(z.object({
      id: z.string(),
      name: z.string().min(1, "Name is required"),
      status: z.enum(["active", "inactive"]),
      employeeCount: z.number().int().nonnegative(),
    }).pick({ id: true })).output(z.object({
      id: z.string(),
      name: z.string().min(1, "Name is required"),
      status: z.enum(["active", "inactive"]),
      employeeCount: z.number().int().nonnegative(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getPositions: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum(["active", "inactive"]).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          id: z.string(),
          name: z.string().min(1, "Name is required"),
          status: z.enum(["active", "inactive"]),
          employeeCount: z.number().int().nonnegative(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  designationRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().min(1, "Designation name is required"),
      status: z.enum(["active", "inactive"]),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().min(1, "Designation name is required"),
      status: z.enum(["active", "inactive"]),
    }).partial().extend({
      id: z.string().min(1, "ID is required"),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      id: z.string(),
      name: z.string().min(1, "Name is required"),
      status: z.enum(["active", "inactive"]),
      employeeCount: z.number().int().nonnegative(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getDesignationById: publicProcedure.input(z.object({
      id: z.string(),
      name: z.string().min(1, "Name is required"),
      status: z.enum(["active", "inactive"]),
      employeeCount: z.number().int().nonnegative(),
    }).pick({ id: true })).output(z.object({
      id: z.string(),
      name: z.string().min(1, "Name is required"),
      status: z.enum(["active", "inactive"]),
      employeeCount: z.number().int().nonnegative(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getDesignations: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum(["active", "inactive"]).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          id: z.string(),
          name: z.string().min(1, "Name is required"),
          status: z.enum(["active", "inactive"]),
          employeeCount: z.number().int().nonnegative(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  assetTypeRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      assetCategoryId: z.number().int().positive(),
      description: z.string().trim().max(500).optional().nullable(),
      depreciable: z.boolean(),
      defaultUsefulLife: z.number().int().positive().optional().nullable(),
      status: z.enum(["active", "inactive"]),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      assetCategoryId: z.number().int().positive(),
      description: z.string().trim().max(500).optional().nullable(),
      depreciable: z.boolean(),
      defaultUsefulLife: z.number().int().positive().optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).partial().refine(({ name, code, assetCategoryId, description, depreciable, defaultUsefulLife, status }) =>
      name !== undefined ||
      code !== undefined ||
      assetCategoryId !== undefined ||
      description !== undefined ||
      depreciable !== undefined ||
      defaultUsefulLife !== undefined ||
      status !== undefined,
      { message: "Provide at least one field to update" }
    )).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      assetCategoryId: z.number().int().positive(),
      description: z.string().trim().max(500).optional().nullable(),
      depreciable: z.boolean(),
      defaultUsefulLife: z.number().int().positive().optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAssetTypeById: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      assetCategoryId: z.number().int().positive(),
      description: z.string().trim().max(500).optional().nullable(),
      depreciable: z.boolean(),
      defaultUsefulLife: z.number().int().positive().optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).pick({ id: true })).output(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      assetCategoryId: z.number().int().positive(),
      description: z.string().trim().max(500).optional().nullable(),
      depreciable: z.boolean(),
      defaultUsefulLife: z.number().int().positive().optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAssetTypes: publicProcedure.input(z
      .object({
        search: z.string().trim().optional(),
        status: z.enum(['active', 'inactive']).optional(),
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
          assetCategoryId: z.number().int().positive(),
          description: z.string().trim().max(500).optional().nullable(),
          depreciable: z.boolean(),
          defaultUsefulLife: z.number().int().positive().optional().nullable(),
          status: z.enum(["active", "inactive"]),
        }).extend({
          id: z.number().int().positive(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          createdBy: z.string().optional().nullable(),
          updatedBy: z.string().optional().nullable(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveAssetTypes: publicProcedure.input(z
      .object({
        assetCategoryId: z.number().int().positive().optional(),
      })
      .default({})).output(z.array(
        z.object({
          id: z.number().int().positive(),
          name: z.string().trim().min(1, "This field is required").max(150),
          code: z.string().trim().min(1, "This field is required").max(50),
        }),
      )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  assetCategoryRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).partial().extend({
      id: z.number().int().positive(),
    }).refine(
      ({ name, description }) =>
        name !== undefined ||
        description !== undefined ||
        { message: "Provide at least one field to update" },
    )).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getCategoryById: publicProcedure.input(z.object({ id: z.number().int().positive() })).output(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getCategories: publicProcedure.input(z
      .object({
        search: z.string().trim().optional(),
        status: z.enum(['active', 'inactive']).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          name: z.string().trim().min(1, "This field is required").max(150),
          description: z.string().trim().max(500).optional().nullable(),
          status: z.enum(["active", "inactive"]),
        }).extend({
          id: z.number().int().positive(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          createdBy: z.string().optional().nullable(),
          updatedBy: z.string().optional().nullable(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveCategories: publicProcedure.output(z.array(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(1, "This field is required").max(150),
      }),
    )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  assetStatusRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
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
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).partial().refine(
      ({ name, code, description, status }) =>
        name !== undefined ||
        code !== undefined ||
        description !== undefined ||
        status !== undefined,
      { message: "Provide at least one field to update" }
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
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAssetStatusById: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).pick({ id: true })).output(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAssetStatuses: publicProcedure.input(z
      .object({
        search: z.string().trim().optional(),
        status: z.enum(['active', 'inactive']).optional(),
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
          status: z.enum(["active", "inactive"]),
        }).extend({
          id: z.number().int().positive(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          createdBy: z.string().optional().nullable(),
          updatedBy: z.string().optional().nullable(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  assetConditionRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
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
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).partial().refine(
      ({ name, code, description, status }) =>
        name !== undefined ||
        code !== undefined ||
        description !== undefined ||
        status !== undefined,
      { message: "Provide at least one field to update" }
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
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).pick({ id: true })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAssetConditionById: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).pick({ id: true })).output(z.object({
      name: z.string().trim().min(1, "This field is required").max(150),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAssetConditions: publicProcedure.input(z
      .object({
        search: z.string().trim().optional(),
        status: z.enum(['active', 'inactive']).optional(),
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
          status: z.enum(["active", "inactive"]),
        }).extend({
          id: z.number().int().positive(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          createdBy: z.string().optional().nullable(),
          updatedBy: z.string().optional().nullable(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveAssetConditions: publicProcedure.output(z.array(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(1, "This field is required").max(150),
      }),
    )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  registrationRouter: t.router({
    create: publicProcedure.input(z.object({
      assetName: z.string().trim().min(1, "This field is required"),
      brand: z.string().min(1, "This field is required"),
      model: z.string().min(1, "This field is required"),
      serialNumber: z.string().min(1, "This field is required"),
      propertyNumber: z.string().optional(),
      qrCode: z.string().optional(),
      description: z.string().optional(),
      quantity: z.number().int().positive().min(1),
      assetPhoto: z.string().nullable().optional(),
      categoryId: z.number().int().positive(),
      assetTypeId: z.number().int().positive(),
      conditionId: z.number().int().positive(),
    }).merge(z.object({
      acquisitionDate: z.coerce.date("This field is required"),
      acquisitionCost: z.number("This field is required").min(0, "This field is required"),
      supplierId: z.number().optional(),
      purchaseOrderNumber: z.string().optional(),
      warranty: z.coerce.number().int().nonnegative().optional(),
      supportingDocs: z.string().optional(),
    })).merge(z.object({
      departmentId: z.number().int().positive().min(1, "This field is required"),
      custodianId: z.number().int().positive().min(1, "This field is required"),
      buildingId: z.number().int().positive().optional(),
      roomId: z.number().int().positive().optional(),
    }))).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  supplierRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(255),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      businessRegistrationNo: z.string().trim().optional().nullable(),
      philGEPsNo: z.string().trim().optional().nullable(),
      TIN: z.string().trim().optional().nullable(),
      VAT: z.boolean(),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(255),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      businessRegistrationNo: z.string().trim().optional().nullable(),
      philGEPsNo: z.string().trim().optional().nullable(),
      TIN: z.string().trim().optional().nullable(),
      VAT: z.boolean(),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    }).partial().refine((data) => Object.keys(data).length > 0, {
      message: 'Provide at least one field to update',
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getSupplierById: publicProcedure.input(z.object({ id: z.number().int().positive() })).output(z.object({
      name: z.string().trim().min(1, "This field is required").max(255),
      code: z
        .string()
        .trim()
        .min(1, "This field is required")
        .max(50)
        .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
      businessRegistrationNo: z.string().trim().optional().nullable(),
      philGEPsNo: z.string().trim().optional().nullable(),
      TIN: z.string().trim().optional().nullable(),
      VAT: z.boolean(),
      description: z.string().trim().max(500).optional().nullable(),
      status: z.enum(["active", "inactive"]),
    }).extend({
      id: z.number().int().positive(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      createdBy: z.string().optional().nullable(),
      updatedBy: z.string().optional().nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getSuppliers: publicProcedure.input(z
      .object({
        search: z.string().trim().min(1).max(100).optional(),
        status: z.enum(['active', 'inactive']).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).max(100).optional(),
      })
      .default({})).output(z.object({
        items: z.array(z.object({
          name: z.string().trim().min(1, "This field is required").max(255),
          code: z
            .string()
            .trim()
            .min(1, "This field is required")
            .max(50)
            .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
          businessRegistrationNo: z.string().trim().optional().nullable(),
          philGEPsNo: z.string().trim().optional().nullable(),
          TIN: z.string().trim().optional().nullable(),
          VAT: z.boolean(),
          description: z.string().trim().max(500).optional().nullable(),
          status: z.enum(["active", "inactive"]),
        }).extend({
          id: z.number().int().positive(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          createdBy: z.string().optional().nullable(),
          updatedBy: z.string().optional().nullable(),
        })),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalPages: z.number().int().nonnegative(),
      })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getActiveSuppliers: publicProcedure.output(z.array(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(1, "This field is required").max(255),
      }),
    )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

