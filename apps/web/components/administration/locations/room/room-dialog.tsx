"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { CreateRoomInput, roomFieldSchema } from "@repo/trpc/schemas";

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateRoomInput) => void;
  defaultValues?: CreateRoomInput;
  title?: string;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export function RoomDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Room",
  errorMessage,
  onClearError,
}: RoomDialogProps) {
  const form = useForm<CreateRoomInput>({
    resolver: zodResolver(roomFieldSchema),
    defaultValues: defaultValues ?? {
      name: "",
      code: "",
      roomTypeId: 1,
      buildingId: 1,
      floor: "1st floor",
      departmentId: null,
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (errorMessage) onClearError?.();
    });
    return () => subscription.unsubscribe();
  }, [form, errorMessage, onClearError]);

  const roomTypes = [
    { id: 1, name: "Conference" },
    { id: 2, name: "Office" },
    { id: 3, name: "Storage" },
    { id: 4, name: "Executive" },
    { id: 5, name: "Training" },
    { id: 6, name: "Server" },
    { id: 7, name: "Pantry" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 p-3 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        )}
        <form id="room-form" className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-name">Room Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter room name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-code">Room Code</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter room code"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="roomTypeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-room-type">Room Type</FieldLabel>
                  <Select
                    name={field.name}
                    value={String(form.watch("roomTypeId"))}
                    onValueChange={(value) => form.setValue("roomTypeId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="floor"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-floor">Floor</FieldLabel>
                  <Select
                    name={field.name}
                    value={form.watch("floor")}
                    onValueChange={(value) => form.setValue("floor", value as "1st floor" | "2nd floor" | "3rd floor" | "4th floor")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1st floor">1st Floor</SelectItem>
                        <SelectItem value="2nd floor">2nd Floor</SelectItem>
                        <SelectItem value="3rd floor">3rd Floor</SelectItem>
                        <SelectItem value="4th floor">4th Floor</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="departmentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-department">Department (Optional)</FieldLabel>
                  <Select
                    name={field.name}
                    value={form.watch("departmentId") ? String(form.watch("departmentId")) : "none"}
                    onValueChange={(value) => form.setValue("departmentId", value === "none" ? null : Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1">Administration</SelectItem>
                        <SelectItem value="2">IT</SelectItem>
                        <SelectItem value="3">HR</SelectItem>
                        <SelectItem value="4">Finance</SelectItem>
                        <SelectItem value="5">Executive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
