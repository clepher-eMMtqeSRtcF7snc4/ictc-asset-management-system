"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { trpc } from "@/lib/trpc/client";
import { UserFormData, userFormSchema } from "@/lib/auth/schema";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => void;
  isPending?: boolean;
}

export function UserDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: UserDialogProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      employeeId: undefined,
    },
  });

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const departmentsQuery = trpc.departmentRouter.getActiveDepartments.useQuery();
  const employeesQuery = trpc.employeeRouter.getActiveEmployees.useQuery(
    selectedDepartment
      ? { departmentId: Number(selectedDepartment) }
      : {},
    {
      enabled: !!selectedDepartment,
    }
  );

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        email: "",
        password: "",
        employeeId: undefined,
      });
      setSelectedDepartment("");
    }
  }, [open, form]);

  const departments = departmentsQuery.data ?? [];
  const employees = employeesQuery.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a new user account. Only administrators can create users.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((data: UserFormData) => onSubmit(data))}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-form-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="user-form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter user name."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="user-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter user email address."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-form-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="user-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter user password."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="user-form-department">
                Department
              </FieldLabel>
              <Combobox
                options={departments.map((d) => ({
                  id: String(d.id),
                  name: d.name,
                }))}
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  form.setValue("employeeId", undefined);
                }}
                placeholder={
                  departmentsQuery.isLoading
                    ? "Loading departments..."
                    : "Select department"
                }
                fullWidth
              />
            </Field>

            {selectedDepartment && (
              <Controller
                name="employeeId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="user-form-employee">Employee</FieldLabel>
                    <Combobox
                      options={employees.map((e) => ({
                        id: String(e.id),
                        name: e.name,
                      }))}
                      value={field.value ?? ""}
                      onValueChange={(value) =>
                        field.onChange(value || undefined)
                      }
                      placeholder={
                        employeesQuery.isLoading
                          ? "Loading employees..."
                          : "Select employee"
                      }
                      fullWidth
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating user..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserDialog;
