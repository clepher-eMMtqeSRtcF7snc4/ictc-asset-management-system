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
import { CustodianDialog } from "./custodian-dialog";
import { CustodianDeleteDialog } from "./custodian-delete-dialog";
import { CustodiansTable } from "./custodians-table";
import type { Custodian } from "@/components/administration/master-data/types";
import type { CustodianFormValues } from "./custodian-form-schema";
import { mockCustodians } from "@/components/administration/master-data/mock-data";

// TODO: Replace mockCustodians with tRPC query / User Management data when backend integration is implemented.

export function CustodiansSection() {
  const [custodians, setCustodians] = useState<Custodian[]>(mockCustodians);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCustodian, setSelectedCustodian] = useState<Custodian | null>(null);

  const filteredCustodians = useMemo(() => {
    return custodians.filter((custodian) => {
      const fullName = `${custodian.firstName} ${custodian.lastName}`.toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search.toLowerCase()) ||
        custodian.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchesDepartment = department === "all" || custodian.department === department;
      const matchesStatus = status === "all" || custodian.status === status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [custodians, search, department, status]);

  const handleCreate = (values: CustodianFormValues) => {
    const newCustodian: Custodian = {
      id: Date.now().toString(),
      employeeId: values.employeeId,
      firstName: values.firstName,
      middleName: values.middleName || undefined,
      lastName: values.lastName,
      position: values.position,
      department: values.department,
      office: values.office,
      status: values.status,
      assignedAssets: 0,
    };
    setCustodians([...custodians, newCustodian]);
    setCreateOpen(false);
    toast.success("Custodian created successfully.");
  };

  const handleEdit = (values: CustodianFormValues) => {
    if (!selectedCustodian) return;
    setCustodians(
      custodians.map((c) =>
        c.id === selectedCustodian.id
          ? {
              ...c,
              employeeId: values.employeeId,
              firstName: values.firstName,
              middleName: values.middleName || undefined,
              lastName: values.lastName,
              position: values.position,
              department: values.department,
              office: values.office,
              status: values.status,
            }
          : c
      )
    );
    setEditOpen(false);
    setSelectedCustodian(null);
    toast.success("Custodian updated successfully.");
  };

  const handleDelete = () => {
    if (!selectedCustodian) return;
    setCustodians(custodians.filter((c) => c.id !== selectedCustodian.id));
    setDeleteOpen(false);
    setSelectedCustodian(null);
    toast.success("Custodian deleted successfully.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Custodians</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employees who can be assigned accountability for assets.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Custodian
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            placeholder="Search custodians..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="ICT">ICT</SelectItem>
              <SelectItem value="Supply">Supply</SelectItem>
              <SelectItem value="Accounting">Accounting</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectContent>
          </Select>
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
        <CustodiansTable
          data={filteredCustodians}
          onEdit={(custodian) => {
            setSelectedCustodian(custodian);
            setEditOpen(true);
          }}
          onDelete={(custodian) => {
            setSelectedCustodian(custodian);
            setDeleteOpen(true);
          }}
        />
      </CardContent>

      <CustodianDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Custodian"
      />

      <CustodianDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedCustodian
            ? {
                employeeId: selectedCustodian.employeeId,
                firstName: selectedCustodian.firstName,
                middleName: selectedCustodian.middleName || "",
                lastName: selectedCustodian.lastName,
                position: selectedCustodian.position,
                department: selectedCustodian.department,
                office: selectedCustodian.office,
                status: selectedCustodian.status,
              }
            : undefined
        }
        title="Edit Custodian"
      />

      <CustodianDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        custodianName={`${selectedCustodian?.firstName} ${selectedCustodian?.lastName}`}
      />
    </Card>
  );
}
