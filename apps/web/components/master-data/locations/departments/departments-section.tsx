"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DepartmentDialog } from "./department-dialog";
import { DepartmentDeleteDialog } from "./department-delete-dialog";
import { DepartmentsTable } from "./departments-table";
import type { Department } from "@repo/trpc/schemas";
import type { DepartmentFormValues } from "./department-form-schema";
import { mockDepartments } from "@/components/master-data/mock-data";

// TODO: Replace mockDepartments with tRPC query when backend integration is implemented.

export function DepartmentsSection() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        !search ||
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || dept.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [departments, search, status]);

  const handleCreate = (values: DepartmentFormValues) => {
    const newDepartment: Department = {
      id: Date.now(),
      code: values.code,
      name: values.name,
      shortName: values.shortName || null,
      description: values.description || null,
      parentDepartmentId: null,
      headUserId: values.head || null,
      type: "Administrative",
      status: values.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDepartments([...departments, newDepartment]);
    setCreateOpen(false);
    toast.success("Department created successfully.");
  };

  const handleEdit = (values: DepartmentFormValues) => {
    if (!selectedDepartment) return;
    setDepartments(
      departments.map((d) =>
        d.id === selectedDepartment.id
          ? {
              ...d,
              code: values.code,
              name: values.name,
              shortName: values.shortName || null,
              description: values.description || null,
              headUserId: values.head || null,
              type: d.type,
              status: values.status,
              updatedAt: new Date(),
            }
          : d
      )
    );
    setEditOpen(false);
    setSelectedDepartment(null);
    toast.success("Department updated successfully.");
  };

  const handleDelete = () => {
    if (!selectedDepartment) return;
    setDepartments(departments.filter((d) => d.id !== selectedDepartment.id));
    setDeleteOpen(false);
    setSelectedDepartment(null);
    toast.success("Department deleted successfully.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Departments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage organizational departments used by users and assets.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Department
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DepartmentsTable
          data={filteredDepartments}
          onEdit={(dept) => {
            setSelectedDepartment(dept);
            setEditOpen(true);
          }}
          onDelete={(dept) => {
            setSelectedDepartment(dept);
            setDeleteOpen(true);
          }}
        />
      </CardContent>

      <DepartmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Department"
      />

      <DepartmentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedDepartment
            ? {
                code: selectedDepartment.code,
                name: selectedDepartment.name,
                shortName: selectedDepartment.shortName || "",
                head: selectedDepartment.headUserId || "",
                status: selectedDepartment.status,
                description: selectedDepartment.description || "",
              }
            : undefined
        }
        title="Edit Department"
      />

      <DepartmentDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        departmentName={selectedDepartment?.name ?? ""}
      />
    </Card>
  );
}
