"use client";

import { useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeFilters } from "@/components/administration/employees/employee-filters";
import { EmployeeTable } from "@/components/administration/employees/employee-table";
import { EmployeeDialog } from "@/components/administration/employees/employee-dialog";
import { EmployeeDeleteDialog } from "@/components/administration/employees/employee-delete-dialog";
import { CreateEmployeeInput, Employee } from "@repo/trpc/schemas";
import { trpc } from "@/lib/trpc/client";
import { PositionSection } from "@/components/administration/employees-settings/position-section";
import { DesignationSection } from "@/components/administration/employees-settings/designation-section";

export default function Page() {
  const searchParams = useSearchParams();
  const initialDepartmentId = searchParams.get("departmentId");

  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState<string>(initialDepartmentId ?? "all");
  const [position, setPosition] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("employees");

  const departmentsQuery = trpc.departmentRouter.getDepartments.useQuery(
    { page: 1, pageSize: 100 },
    { placeholderData: keepPreviousData }
  );

  const positionsQuery = trpc.positionRouter.getPositions.useQuery(
    { status: "active", pageSize: 100 },
    { placeholderData: keepPreviousData }
  );

  const designationsQuery = trpc.designationRouter.getDesignations.useQuery(
    { status: "active", pageSize: 100 },
    { placeholderData: keepPreviousData }
  );

  const employeesQuery = trpc.employeeRouter.getEmployees.useQuery(
    {
      search: search || undefined,
      departmentId: departmentId === "all" ? undefined : Number(departmentId),
      positionId: position || undefined,
      designationId: designation || undefined,
      status: status === "all" ? undefined : (status as any),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const editEmployeeQuery = trpc.employeeRouter.getEmployeeById.useQuery(
    { id: editId! },
    { enabled: editId !== null },
  );

  const employees = employeesQuery.data?.items ?? [];
  const totalPages = employeesQuery.data?.totalPages ?? 1;
  const departments = departmentsQuery.data?.items ?? [];
  const positions = positionsQuery.data?.items ?? [];
  const designations = designationsQuery.data?.items ?? [];

  const enrichedEmployees = useMemo(() => {
    const positionMap = new Map(positions.map((p) => [p.id, p.name]));
    const designationMap = new Map(designations.map((d) => [d.id, d.name]));
    const departmentMap = new Map(departments.map((d) => [d.id, { code: d.code, color: d.color }]));

    return employees.map((emp) => {
      const dept = departmentMap.get(emp.departmentId ?? 0);
      return {
        ...emp,
        position: (emp.position != null ? positionMap.get(emp.position) : null) ?? "—",
        designation: (emp.designation != null ? designationMap.get(emp.designation) : null) ?? "—",
        departmentCode: dept?.code ?? "—",
        departmentColor: dept?.color ?? null,
      } as Employee & { departmentCode: string; departmentColor: string | null };
    });
  }, [employees, positions, designations, departments]);

  const editDefaults = useMemo(() => {
    const emp = editEmployeeQuery.data;
    return emp
      ? {
          firstName: emp.firstName,
          middleName: emp.middleName ?? null,
          lastName: emp.lastName,
          email: emp.email,
          position: emp.position,
          designation: emp.designation,
          departmentId: emp.departmentId ?? 0,
          role: emp.role ?? null,
          status: emp.status,
          photo: emp.photo ?? null,
        }
      : undefined;
  }, [editEmployeeQuery.data]);

  const utils = trpc.useUtils();
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

  const handleCreateEmployee = (values: CreateEmployeeInput) => {
    setCreateError(null);
    createEmployee.mutate(values);
  };

  const updateEmployee = trpc.employeeRouter.update.useMutation({
    onSuccess: () => {
      utils.employeeRouter.getEmployees.invalidate();
      utils.employeeRouter.getEmployeeById.invalidate();
      setEditOpen(false);
      setSelectedEmployee(null);
      setEditError(null);
      toast.success("Employee updated successfully.");
    },
    onError: (error) => {
      setEditError(error.message ?? "Failed to update employee.");
      toast.error(error.message ?? "Failed to update employee.");
    },
  });

  const handleUpdateEmployee = (values: CreateEmployeeInput) => {
    if (editId === null) return;
    updateEmployee.mutate({ id: editId, ...values });
  };

  const deleteEmployee = trpc.employeeRouter.delete.useMutation({
    onSuccess: () => {
      utils.employeeRouter.getEmployees.invalidate();
      setDeleteOpen(false);
      setSelectedEmployee(null);
      toast.success("Employee deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete employee.");
    },
  });

  const handleDeleteEmployee = () => {
    if (selectedEmployee === null) return;
    deleteEmployee.mutate({ id: selectedEmployee.id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Employees</h2>
        <p className="text-sm text-muted-foreground">
          Manage employees for departments.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="employees" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>All Employees</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and manage employee records.
                </p>
              </div>
              <Button onClick={() => {
                setCreateError(null);
                setCreateOpen(true);
              }}>
                <Plus /> Create Employee
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              <EmployeeFilters
                search={search}
                onSearchChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                departmentId={departmentId}
                onDepartmentIdChange={(value) => {
                  setDepartmentId(value);
                  setPage(1);
                }}
                departments={departments.map(d => ({ id: d.id, name: d.name }))}
                position={position}
                onPositionChange={(value) => {
                  setPosition(value);
                  setPage(1);
                }}
                designation={designation}
                onDesignationChange={(value) => {
                  setDesignation(value);
                  setPage(1);
                }}
                positions={positions}
                designations={designations}
                status={status}
                onStatusChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              />
              {employeesQuery.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading employees...</p>
                </div>
              ) : (
                <EmployeeTable
                  data={enrichedEmployees}
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onPaginationChange={(next) => {
                    setPage(next.page);
                    setPageSize(next.pageSize);
                  }}
                  onEdit={(emp) => {
                    setEditId(emp.id);
                    setEditOpen(true);
                  }}
                  onDelete={(emp) => {
                    setSelectedEmployee(emp);
                    setDeleteOpen(true);
                  }}
                />
              )}
            </CardContent>

            <EmployeeDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              onSubmit={handleCreateEmployee}
              errorMessage={createError}
              onClearError={() => setCreateError(null)}
              title="Create Employee"
              departments={departments.map(d => ({ id: d.id, name: d.name }))}
            />

            <EmployeeDialog
              open={editOpen}
              onOpenChange={(open) => {
                setEditOpen(open);
                if (!open) setEditId(null);
              }}
              onSubmit={handleUpdateEmployee}
              defaultValues={editDefaults}
              errorMessage={editError}
              onClearError={() => setEditError(null)}
              title="Edit Employee"
              departments={departments.map(d => ({ id: d.id, name: d.name }))}
            />

            <EmployeeDeleteDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              onConfirm={handleDeleteEmployee}
              employeeName={`${selectedEmployee?.firstName ?? ""} ${selectedEmployee?.lastName ?? ""}`}
            />
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4 space-y-4">
          <PositionSection
            employeePositions={employees.map((emp) => ({ position: emp.position ?? "", status: emp.status }))}
          />
          <DesignationSection
            employeeDesignations={employees.map((emp) => ({ designation: emp.designation ?? "", status: emp.status }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
