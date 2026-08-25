"use client";

import { useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BuildingFilters } from "@/components/administration/locations/buidling/building-filters";
import { BuildingTable } from "@/components/administration/locations/buidling/building-table";
import { BuildingDialog } from "@/components/administration/locations/buidling/building-dialog";
import { BuildingDeleteDialog } from "@/components/administration/locations/buidling/building-delete-dialog";
import { Building, CreateBuildingInput } from "@repo/trpc/schemas";
import { CreateDepartmentInput, Department } from "@repo/trpc/schemas";
import { trpc } from "@/lib/trpc/client";
import { DepartmentFilters } from "@/components/administration/locations/department/department-filters";
import { DepartmentTable } from "@/components/administration/locations/department/department-table";
import { DepartmentDialog } from "@/components/administration/locations/department/department-dialog";
import { DepartmentDeleteDialog } from "@/components/administration/locations/department/department-delete-dialog";

export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deptSearch, setDeptSearch] = useState("");
  const [deptStatus, setDeptStatus] = useState("all");
  const [deptPage, setDeptPage] = useState(1);
  const [deptPageSize, setDeptPageSize] = useState(10);
  const [deptCreateOpen, setDeptCreateOpen] = useState(false);
  const [deptEditOpen, setDeptEditOpen] = useState(false);
  const [deptDeleteOpen, setDeptDeleteOpen] = useState(false);
  const [deptEditId, setDeptEditId] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deptCreateError, setDeptCreateError] = useState<string | null>(null);

  const handleAssignHead = (department: Department) => {
    router.push(`/administration/employees?departmentId=${department.id}&role=supervisor`);
  };

  const handleAssignCustodian = (department: Department) => {
    router.push(`/administration/employees?departmentId=${department.id}&role=custodian`);
  };

  const departmentsQuery = trpc.departmentRouter.getDepartments.useQuery(
    {
      search: deptSearch || undefined,
      status: deptStatus === "all" ? undefined : (deptStatus as "active" | "inactive"),
      page: deptPage,
      pageSize: deptPageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const editDepartmentQuery = trpc.departmentRouter.getDepartmentById.useQuery(
    { id: deptEditId! },
    { enabled: deptEditId !== null },
  );

  const departments = departmentsQuery.data?.items ?? [];
  const deptTotalPages = departmentsQuery.data?.totalPages ?? 1;

  const deptEditDefaults = useMemo(() => {
    const dept = editDepartmentQuery.data;
    return dept
      ? {
          code: dept.code,
          name: dept.name,
          description: dept.description || "",
          supervisor: dept.supervisor,
          custodian: dept.custodian || "",
          logo: dept.logo || null,
          color: dept.color || null,
          status: dept.status,
        }
      : undefined;
  }, [editDepartmentQuery.data]);

  const createDepartment = trpc.departmentRouter.create.useMutation({
    onSuccess: () => {
      utils.departmentRouter.getDepartments.invalidate();
      setDeptCreateError(null);
      setDeptCreateOpen(false);
      toast.success("Department created successfully.");
    },
    onError: (error) => {
      setDeptCreateError(error.message ?? "Failed to create department.");
      toast.error(error.message ?? "Failed to create department.");
    },
  });

  const handleCreateDepartment = async (values: CreateDepartmentInput) => {
    setDeptCreateError(null);
    await createDepartment.mutateAsync(values);
  };

  const updateDepartment = trpc.departmentRouter.update.useMutation({
    onSuccess: () => {
      utils.departmentRouter.getDepartments.invalidate();
      utils.departmentRouter.getDepartmentById.invalidate();
      setDeptEditOpen(false);
      setSelectedDepartment(null);
      toast.success("Department updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update department.");
    },
  });

  const handleUpdateDepartment = async (values: CreateDepartmentInput) => {
    if (deptEditId === null) return;
    await updateDepartment.mutateAsync({ id: deptEditId, ...values });
  };

  const deleteDepartment = trpc.departmentRouter.delete.useMutation({
    onSuccess: () => {
      utils.departmentRouter.getDepartments.invalidate();
      setDeptDeleteOpen(false);
      setSelectedDepartment(null);
      toast.success("Department deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete department.");
    },
  });

  const handleDeleteDepartment = () => {
    if (selectedDepartment === null) return;
    deleteDepartment.mutate({ id: selectedDepartment.id });
  };

  const buildingsQuery = trpc.buildingRouter.getBuildings.useQuery(
    {
      search: search || undefined,
      status: status === "all" ? undefined : (status as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const editBuildingQuery = trpc.buildingRouter.getBuildingById.useQuery(
    { id: editId! },
    { enabled: editId !== null },
  );

  const buildings = buildingsQuery.data?.items ?? [];
  const totalPages = buildingsQuery.data?.totalPages ?? 1;

  const editDefaults = useMemo(() => {
    const building = editBuildingQuery.data;
    return building
      ? {
          code: building.code,
          name: building.name,
          description: building.description,
          status: building.status,
        }
      : undefined;
  }, [editBuildingQuery.data]);

  const utils = trpc.useUtils();
  const createBuilding = trpc.buildingRouter.create.useMutation({
    onSuccess: () => {
      utils.buildingRouter.getBuildings.invalidate();
      setCreateError(null);
      setCreateOpen(false);
      toast.success("Building created successfully.");
    },
    onError: (error) => {
      setCreateError(error.message ?? "Failed to create building.");
      toast.error(error.message ?? "Failed to create building.");
    },
  });

  const handleCreate = (values: CreateBuildingInput) => {
    setCreateError(null);
    createBuilding.mutate(values);
  };

  const updateBuilding = trpc.buildingRouter.update.useMutation({
    onSuccess: () => {
      utils.buildingRouter.getBuildings.invalidate();
      utils.buildingRouter.getBuildingById.invalidate();
      setEditOpen(false);
      setSelectedBuilding(null);
      toast.success("Building updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update building.");
    },
  });

  const handleUpdate = (values: CreateBuildingInput) => {
    if (editId === null) return;
    updateBuilding.mutate({ id: editId, ...values });
  };

  const deleteBuilding = trpc.buildingRouter.delete.useMutation({
    onSuccess: () => {
      utils.buildingRouter.getBuildings.invalidate();
      setDeleteOpen(false);
      setSelectedBuilding(null);
      toast.success("Building deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete building.");
    },
  });

  const handleDelete = () => {
    if (selectedBuilding === null) return;
    deleteBuilding.mutate({ id: selectedBuilding.id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Locations</h2>
        <p className="text-sm text-muted-foreground">
          Manage physical and organizational reference data
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Building</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage building and physical locations used by assets.
            </p>
          </div>
          <Button onClick={() => {
            setCreateError(null);
            setCreateOpen(true);
          }}>
            <Plus /> Create Building
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <BuildingFilters
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
          <BuildingTable
              data={buildings}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(building) => {
              setEditId(building.id);
              setEditOpen(true);
            }}
            onDelete={(building) => {
              setSelectedBuilding(building);
              setDeleteOpen(true);
            }}
          />
        </CardContent>

        <BuildingDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          errorMessage={createError}
          onClearError={() => setCreateError(null)}
          title="Create Building"
        />

        <BuildingDialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) setEditId(null);
          }}
          onSubmit={handleUpdate}
          defaultValues={editDefaults}
          title="Edit Building"
        />

        <BuildingDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          roomName={selectedBuilding?.name ?? ""}
        />
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Department</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage organizational departments.
            </p>
          </div>
          <Button onClick={() => {
            setDeptCreateError(null);
            setDeptCreateOpen(true);
          }}>
            <Plus /> Create Department
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <DepartmentFilters
            search={deptSearch}
            onSearchChange={(value) => {
              setDeptSearch(value);
              setDeptPage(1);
            }}
            status={deptStatus}
            onStatusChange={(value) => {
              setDeptStatus(value);
              setDeptPage(1);
            }}
          />
          {departmentsQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading departments...</p>
            </div>
          ) : (
            <DepartmentTable
              data={departments as Department[]}
              page={deptPage}
              pageSize={deptPageSize}
              totalPages={deptTotalPages}
              onPaginationChange={(next) => {
                setDeptPage(next.page);
                setDeptPageSize(next.pageSize);
              }}
              onEdit={(dept) => {
                setDeptEditId(dept.id);
                setDeptEditOpen(true);
              }}
              onDelete={(dept) => {
                setSelectedDepartment(dept);
                setDeptDeleteOpen(true);
              }}
              onAssignHead={handleAssignHead}
              onAssignCustodian={handleAssignCustodian}
            />
          )}
        </CardContent>

        <DepartmentDialog
          open={deptCreateOpen}
          onOpenChange={setDeptCreateOpen}
          onSubmit={handleCreateDepartment}
          errorMessage={deptCreateError}
          onClearError={() => setDeptCreateError(null)}
          title="Create Department"
        />

        <DepartmentDialog
          open={deptEditOpen}
          onOpenChange={(open) => {
            setDeptEditOpen(open);
            if (!open) setDeptEditId(null);
          }}
          onSubmit={handleUpdateDepartment}
          defaultValues={deptEditDefaults}
          title="Edit Department"
        />

        <DepartmentDeleteDialog
          open={deptDeleteOpen}
          onOpenChange={setDeptDeleteOpen}
          onConfirm={handleDeleteDepartment}
          departmentName={selectedDepartment?.name ?? ""}
        />
      </Card>
    </div>
  );
}
