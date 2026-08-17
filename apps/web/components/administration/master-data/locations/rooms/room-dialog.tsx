"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { roomFormSchema } from "./room-form-schema";
import type { RoomFormValues } from "./room-form-schema";

const roomTypes = [
  "Office",
  "Classroom",
  "Laboratory",
  "Server Room",
  "Storage Room",
  "Warehouse",
  "Meeting Room",
  "Other",
];

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RoomFormValues) => void;
  defaultValues?: RoomFormValues;
  title?: string;
}

export function RoomDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Room",
}: RoomDialogProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: defaultValues ?? {
      code: "",
      name: "",
      building: "",
      floor: "",
      department: "",
      roomType: "",
      custodian: "",
      status: "active",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Room Code</Label>
              <Input className="mt-1" {...form.register("code")} />
              {form.formState.errors.code && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>
            <div>
              <Label>Room Name</Label>
              <Input className="mt-1" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Building</Label>
              <Input className="mt-1" {...form.register("building")} />
              {form.formState.errors.building && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.building.message}
                </p>
              )}
            </div>
            <div>
              <Label>Floor</Label>
              <Input className="mt-1" {...form.register("floor")} />
              {form.formState.errors.floor && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.floor.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Department</Label>
              <Input className="mt-1" {...form.register("department")} />
              {form.formState.errors.department && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.department.message}
                </p>
              )}
            </div>
            <div>
              <Label>Room Type</Label>
              <Select
                value={form.watch("roomType")}
                onValueChange={(value) => form.setValue("roomType", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.roomType && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.roomType.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>Custodian</Label>
            <Input className="mt-1" {...form.register("custodian")} />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) => form.setValue("status", value as RoomFormValues["status"])}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
