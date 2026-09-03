"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/image";
import Image from "next/image";
import { DepartmentEmployeeFilters } from "@/components/administration/locations/department-employee/dep-emp-filters";
import { DepartmentEmployeeTable } from "@/components/administration/locations/department-employee/dep-emp-table";
import { DepartmentEmployeeDialog } from "@/components/administration/locations/department-employee/dep-emp-dialog";
import { DepartmentEmployeeDeleteDialog } from "@/components/administration/locations/department-employee/dep-emp-delete-dialog";
import { EmployeeRow } from "@/components/administration/locations/department-employee/dep-emp-types";
import { CreateEmployeeInput, Employee } from "@repo/trpc/schemas";

const DEFAULT_PAGE_SIZE = 10;

export default function Page() {
  const params = useParams();
  const departmentId = params.departmentId ? Number(params.departmentId) : null;
  const [createOpen, setCreateOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [status, setStatus] = useState("all");
  const [position, setPosition] = useState("");
  const [designation, setDesignation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const departmentsQuery = trpc.departmentRouter.getDepartments.useQuery(
    { pageSize: 100 },
    { enabled: !!departmentId }
  );

  const positionsQuery = trpc.positionRouter.getPositions.useQuery(
    { status: "active", pageSize: 100 },
    { enabled: !!departmentId }
  );

  const designationsQuery = trpc.designationRouter.getDesignations.useQuery(
    { status: "active", pageSize: 100 },
    { enabled: !!departmentId }
  );

  const department = trpc.departmentRouter.getDepartmentById.useQuery(
    { id: departmentId! },
    { enabled: !!departmentId }
  );

  const supervisorQuery = trpc.employeeRouter.getEmployeeById.useQuery(
    { id: department.data?.supervisorId ?? 0 },
    { enabled: !!departmentId && !!department.data?.supervisorId }
  );

  const employeesQuery = trpc.employeeRouter.getEmployees.useQuery(
    {
      search: search || undefined,
      departmentId: departmentId ? Number(departmentId) : undefined,
      positionId: position || undefined,
      designationId: designation || undefined,
      status: status === "all" ? undefined : (status as any),
      page,
      pageSize,
    },
    { enabled: !!departmentId }
  );

  const employees = employeesQuery.data?.items ?? [];
  const totalPages = employeesQuery.data?.totalPages ?? 1;

  const enrichedEmployees = useMemo(() => {
    const departmentMap = new Map(departmentsQuery.data?.items.map((d) => [d.id, { code: d.code, color: d.color }]));
    const positionMap = new Map(positionsQuery.data?.items.map((p) => [p.id, p.name]));
    const designationMap = new Map(designationsQuery.data?.items.map((d) => [d.id, d.name]));

    return employees.map((emp) => {
      const dept = departmentMap.get(emp.departmentId ?? 0);
      return {
        ...emp,
        departmentCode: dept?.code ?? "—",
        departmentColor: dept?.color ?? null,
        positionName: emp.position ? (positionMap.get(emp.position) ?? emp.position) : "—",
        designationName: emp.designation ? (designationMap.get(emp.designation) ?? emp.designation) : "—",
      };
    });
  }, [employees, departmentsQuery.data, positionsQuery.data, designationsQuery.data]);

  const createMutation = trpc.employeeRouter.create.useMutation({
    onSuccess: () => {
      utils.employeeRouter.getEmployees.invalidate();
      setCreateOpen(false);
      setErrorMessage(null);
      toast.success("Employee created successfully.");
    },
    onError: (error) => {
      setErrorMessage(error.message ?? "Failed to create employee.");
      toast.error(error.message ?? "Failed to create employee.");
    },
  });

  const updateMutation = trpc.employeeRouter.update.useMutation({
    onSuccess: () => {
      utils.employeeRouter.getEmployees.invalidate();
      setEditEmployee(null);
      setErrorMessage(null);
      toast.success("Employee updated successfully.");
    },
    onError: (error) => {
      setErrorMessage(error.message ?? "Failed to update employee.");
      toast.error(error.message ?? "Failed to update employee.");
    },
  });

  const deleteMutation = trpc.employeeRouter.delete.useMutation({
    onSuccess: () => {
      utils.employeeRouter.getEmployees.invalidate();
      setDeleteEmployee(null);
      toast.success("Employee deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete employee.");
    },
  });

  const handleCreate = async (values: CreateEmployeeInput) => {
    setErrorMessage(null);
    await createMutation.mutateAsync(values);
  };

  const handleUpdate = async (values: CreateEmployeeInput & { id?: number }) => {
    setErrorMessage(null);
    if (!values.id) return;
    await updateMutation.mutateAsync(values as any);
  };

  const handleDelete = () => {
    if (deleteEmployee) {
      deleteMutation.mutate({ id: deleteEmployee.id });
    }
  };

  const employeeName = (emp: Employee) =>
    `${emp.firstName} ${emp.middleName ?? ""} ${emp.lastName}`.trim();

  return (
    <div className="space-y-6">
      <div>
        <PageHeader
          title={department.data?.name ?? "Loading..."}
          description={department.data?.description ?? "—"}
          action={
            <Link
              className="flex gap-1.5 text-primary text-sm font-semibold"
              href="/administration/locations"
            >
              <ArrowLeft width="20" height="20" /> Back to locations
            </Link>
          }
          icon={
            department.data?.logo ? (
              <Image
                src={getImageUrl(department.data.logo)}
                alt={department.data.name}
                width={40}
                height={40}
                unoptimized
                className="size-10 rounded object-cover"
              />
            ) : null
          }
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Department Employees</CardTitle>
            <p className="text-sm text-muted-foreground">
              {supervisorQuery.data
                ? `Head: ${supervisorQuery.data.firstName} ${supervisorQuery.data.middleName ?? ""} ${supervisorQuery.data.lastName}`.trim()
                : department.data?.supervisorId
                  ? "Loading head..."
                  : "No head assigned."}
            </p>
          </div>
          <Button onClick={() => { setErrorMessage(null); setCreateOpen(true); }}>
            <UserPlus2 /> Add Employee
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <DepartmentEmployeeFilters
            search={search}
            onSearchChange={(value) => { setSearch(value); setPage(1); }}
            status={status}
            onStatusChange={(value) => { setStatus(value); setPage(1); }}
            position={position}
            onPositionChange={(value) => { setPosition(value); setPage(1); }}
            designation={designation}
            onDesignationChange={(value) => { setDesignation(value); setPage(1); }}
            positions={positionsQuery.data?.items ?? []}
            designations={designationsQuery.data?.items ?? []}
          />
          {employeesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading employees...</p>
            </div>
          ) : (
            <DepartmentEmployeeTable
              data={enrichedEmployees as EmployeeRow[]}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              onPaginationChange={(next) => {
                setPage(next.page);
                setPageSize(next.pageSize);
              }}
              onEdit={(emp) => {
                setEditEmployee(emp);
                setErrorMessage(null);
              }}
              onDelete={(emp) => setDeleteEmployee(emp)}
            />
          )}
        </CardContent>
      </Card>

      <DepartmentEmployeeDialog
        open={createOpen}
        onOpenChange={(open) => { setCreateOpen(open); if (!open) setErrorMessage(null); }}
        onSubmit={handleCreate}
        title="Create Employee"
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(null)}
        defaultDepartmentId={departmentId ?? undefined}
        departments={departmentsQuery.data?.items ?? []}
      />

      <DepartmentEmployeeDialog
        open={!!editEmployee}
        onOpenChange={(open) => {
          if (!open) setEditEmployee(null);
        }}
        onSubmit={handleUpdate}
        editId={editEmployee?.id}
        defaultValues={editEmployee ? {
          firstName: editEmployee.firstName,
          middleName: editEmployee.middleName,
          lastName: editEmployee.lastName,
          email: editEmployee.email,
          position: editEmployee.position,
          designation: editEmployee.designation,
          departmentId: editEmployee.departmentId,
          status: editEmployee.status,
          photo: editEmployee.photo,
        } : undefined}
        title={`Edit ${editEmployee ? employeeName(editEmployee) : "Employee"}`}
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(null)}
        departments={departmentsQuery.data?.items ?? []}
      />

      <DepartmentEmployeeDeleteDialog
        open={!!deleteEmployee}
        onOpenChange={(open) => { if (!open) setDeleteEmployee(null); }}
        onConfirm={handleDelete}
        employeeName={deleteEmployee ? employeeName(deleteEmployee) : ""}
      />
    </div>
  );
}
