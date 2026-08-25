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
import { EmployeeTable } from "@/components/administration/employees/employee-table";
import { EmployeeDialog } from "@/components/administration/employees/employee-dialog";
import { EmployeeFilters } from "@/components/administration/employees/employee-filters";
import { CreateEmployeeInput } from "@repo/trpc/schemas";

const DEFAULT_PAGE_SIZE = 10;

export default function Page() {
  const params = useParams();
  const departmentId = params.departmentId ? Number(params.departmentId) : null;
  const [createError, setCreateError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [status, setStatus] = useState("all");
  const [position, setPosition] = useState("");
  const [designation, setDesignation] = useState("");

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
    const positionMap = new Map(positionsQuery.data?.items.map((p) => [p.id, p.name]));
    const designationMap = new Map(designationsQuery.data?.items.map((d) => [d.id, d.name]));
    const departmentMap = new Map(departmentsQuery.data?.items.map((d) => [d.id, { code: d.code, color: d.color }]));

    return employees.map((emp) => {
      const dept = departmentMap.get(emp.departmentId ?? 0);
      return {
        ...emp,
        position: emp.position != null ? (positionMap.get(emp.position) ?? "—") : "—",
        designation: emp.designation != null ? (designationMap.get(emp.designation) ?? "—") : "—",
        departmentCode: dept?.code ?? "—",
        departmentColor: dept?.color ?? null,
      };
    });
  }, [employees, positionsQuery.data, designationsQuery.data, departmentsQuery.data]);

  const createEmployee = trpc.employeeRouter.create.useMutation({
    onSuccess: () => {
      utils.employeeRouter.getEmployees.invalidate();
      setCreateError(null);
      setCreateOpen(false);
      toast.success("Employee created successfully.");
    },
    onError: (error) => {
      setCreateError(error.message ?? "Failed to create employee.");
      toast.error(error.message ?? "Failed to create employee.");
    },
  });

  const handleCreateEmployee = async (values: CreateEmployeeInput) => {
    setCreateError(null);
    await createEmployee.mutateAsync(values);
  };

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
        ></PageHeader>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Department Employees</CardTitle>
            <p className="text-sm text-muted-foreground">
              {department.data?.supervisorId ? `Head: ${department.data.supervisorId}` : "No head assigned."}
            </p>
          </div>
          <div>
            <Button className="ml-1.5" onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}>
              <UserPlus2 /> Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <EmployeeFilters
            search={search}
            onSearchChange={(value) => { setSearch(value); setPage(1); }}
            departmentId={String(departmentId)}
            onDepartmentIdChange={() => {}}
            departments={departmentsQuery.data?.items ?? []}
            position={position}
            onPositionChange={(value) => { setPosition(value); setPage(1); }}
            designation={designation}
            onDesignationChange={(value) => { setDesignation(value); setPage(1); }}
            positions={positionsQuery.data?.items ?? []}
            designations={designationsQuery.data?.items ?? []}
            status={status}
            onStatusChange={(value) => { setStatus(value); setPage(1); }}
          />
          {employeesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading employees...</p>
            </div>
          ) : (
            <EmployeeTable
              data={enrichedEmployees as any}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              onPaginationChange={(next) => {
                setPage(next.page);
                setPageSize(next.pageSize);
              }}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
        </CardContent>
      </Card>

      <EmployeeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateEmployee}
        title="Create Employee"
        departments={departmentsQuery.data?.items.map(d => ({ id: d.id, name: d.name })) ?? []}
      />
    </div>
  );
}
