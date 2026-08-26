"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Combobox } from "@/components/ui/combobox";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { Department } from "@repo/trpc/schemas";
import { getImageUrl } from "@/lib/image";
import Image from "next/image";

const assignSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
});

interface DepartmentAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  mode: "supervisor" | "custodian";
  onSuccess: () => void;
}

export function DepartmentAssignDialog({
  open,
  onOpenChange,
  department,
  mode,
  onSuccess,
}: DepartmentAssignDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const employeesQuery = trpc.departmentRouter.getDepartmentsEmployee.useQuery(
    { pageSize: 200 },
  );

  const employees = (employeesQuery.data?.items ?? []);

  const updateDepartment = trpc.departmentRouter.update.useMutation({
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
  });

  const form = useForm<{ employeeId: string }>({
    resolver: zodResolver(assignSchema),
    defaultValues: { employeeId: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ employeeId: "" });
    }
  }, [open, form]);

  const handleSubmit = async (values: { employeeId: string }) => {
    if (!department) return;

    setSubmitting(true);
    try {
      await updateDepartment.mutateAsync({
        id: department.id,
        ...(mode === "supervisor"
          ? { supervisorId: Number(values.employeeId) }
          : { custodianId: Number(values.employeeId) }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Assign {mode === "supervisor" ? "Department Head" : "Custodian"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <Controller
            name="employeeId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-employee">
                  Select Employee (Regular, Permanent, Contractual)
                </FieldLabel>
                <Combobox
                  options={employees.map((e) => ({
                    id: String(e.id),
                    name: `${e.lastName}, ${e.firstName}${e.middleName ? ` ${e.middleName[0]}.` : ""}`,
                    photoUrl: e.photo ? getImageUrl(e.photo) : null,
                    status: e.status,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Search employee..."
                  className="w-full"
                  fullWidth
                  renderOption={(option) => {
                    const status = (option as any).status;
                    const getVariant = (s: string): "success" | "info" | "warning" | "destructive" => {
                      if (s === "active" || s === "contractual" || s === "permanent") return "success";
                      if (s === "job-order" || s === "casual" || s === "temporary" || s === "probationary") return "info";
                      if (s === "on-leave") return "warning";
                      return "destructive";
                    };
                    return (
                      <div className="flex items-center gap-2">
                        {option.photoUrl ? (
                          <Image
                            src={option.photoUrl}
                            alt="Employee photo"
                            unoptimized
                            width={24}
                            height={24}
                            className="size-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                            {option.name.slice(0, 1)}
                          </div>
                        )}
                        <span className="flex-1">{option.name}</span>
                        <Badge variant={getVariant(status ?? "active")}>
                          {status === "active" ? "Regular" : status?.replace(/-/g, " ")}
                        </Badge>
                      </div>
                    );
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || employeesQuery.isLoading}>
              {submitting ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
