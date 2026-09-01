"use client";

import { useEffect, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import {
  CreateSupplierInput,
  Supplier,
  UpdateSupplierInput,
} from "@repo/trpc/schemas";
import { SupplierFilters } from "./filters";
import { SupplierDialog } from "./dialog";
import { SupplierTable } from "./table";
import { SupplierDeleteDialog } from "./delete-dialog";

export function SupplierSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const suppliersQuery = trpc.supplierRouter.getSuppliers.useQuery(
    {
      search: search || undefined,
      status:
        statusFilter === "all"
          ? undefined
          : (statusFilter as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const totalPages = suppliersQuery.data?.totalPages ?? 1;

  const utils = trpc.useUtils();

  const createSupplier = trpc.supplierRouter.create.useMutation({
    onSuccess: () => {
      utils.supplierRouter.getSuppliers.invalidate();
      setCreateOpen(false);
      toast.success("Supplier created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create supplier.");
    },
  });

  const updateSupplier = trpc.supplierRouter.update.useMutation({
    onSuccess: () => {
      utils.supplierRouter.getSuppliers.invalidate();
      setEditOpen(false);
      setSelectedSupplier(null);
      toast.success("Supplier updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update supplier.");
    },
  });

  const deleteSupplier = trpc.supplierRouter.delete.useMutation({
    onSuccess: () => {
      utils.supplierRouter.getSuppliers.invalidate();
      setDeleteOpen(false);
      setSelectedSupplier(null);
      toast.success("Supplier deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete supplier.");
    },
  });

  const handleCreate = (values: CreateSupplierInput) => {
    createSupplier.mutate(values);
  };

  const handleEdit = (values: UpdateSupplierInput) => {
    if (!selectedSupplier) return;
    updateSupplier.mutate({ id: selectedSupplier.id, ...values });
  };

  const handleDelete = () => {
    if (!selectedSupplier) return;
    deleteSupplier.mutate({ id: selectedSupplier.id });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Suppliers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage supplier profiles and information.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Supplier
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SupplierFilters
          search={search}
          setSearch={setSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
        />

        {suppliersQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading suppliers...</p>
          </div>
        ) : (
          <SupplierTable
            data={
              (suppliersQuery.data?.items ?? []).map((item) => ({
                ...item,
                createdAt: item.createdAt
                  ? new Date(item.createdAt)
                  : undefined,
                updatedAt: item.updatedAt
                  ? new Date(item.updatedAt)
                  : undefined,
              })) as Supplier[]
            }
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(supplier) => {
              setSelectedSupplier(supplier);
              setEditOpen(true);
            }}
            onDelete={(supplier) => {
              setSelectedSupplier(supplier);
              setDeleteOpen(true);
            }}
          />
        )}
      </CardContent>

      <SupplierDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Supplier"
      />

      <SupplierDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedSupplier
            ? {
                code: selectedSupplier.code,
                name: selectedSupplier.name,
                description: selectedSupplier.description ?? null,
                businessRegistrationNo:
                  selectedSupplier.businessRegistrationNo ?? null,
                philGEPsNo: selectedSupplier.philGEPsNo ?? null,
                TIN: selectedSupplier.TIN ?? null,
                VAT: selectedSupplier.VAT,
                status: selectedSupplier.status,
              }
            : undefined
        }
        title="Edit Supplier"
      />

      <SupplierDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        supplierName={selectedSupplier?.name ?? ""}
      />
    </Card>
  );
}
