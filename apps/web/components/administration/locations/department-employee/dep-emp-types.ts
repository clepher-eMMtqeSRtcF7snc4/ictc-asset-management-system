import type { Employee } from "@repo/trpc/schemas";

export type EmployeeRow = Employee & {
  departmentCode: string;
  departmentColor: string | null;
  positionName: string;
  designationName: string;
};
