"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { RoleAssignment } from "@/lib/auth/schema";

interface ManageRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  userEmail: string;
  assignments: RoleAssignment[] | undefined;
  isLoading: boolean;
  onSave: (userId: string, roleIds: string[]) => void;
  isPending: boolean;
}

export function ManageRolesDialog({
  open,
  onOpenChange,
  userId,
  userName,
  userEmail,
  assignments,
  isLoading,
  onSave,
  isPending,
}: ManageRolesDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open && assignments !== undefined) {
      const assigned = assignments
        .filter((r) => r.assigned)
        .map((r) => r.id);
      setSelectedRoles(new Set(assigned));
    }
  }, [open, assignments]);

  const hasChanges = (() => {
    if (!assignments) return false;
    const currentAssigned = new Set(
      assignments.filter((r) => r.assigned).map((r) => r.id),
    );
    if (currentAssigned.size !== selectedRoles.size) return true;
    return ![...currentAssigned].every((id) => selectedRoles.has(id));
  })();

  const handleToggle = (roleId: string) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else {
      newSelected.add(roleId);
    }
    setSelectedRoles(newSelected);
  };

  const handleSave = () => {
    if (!hasChanges) return;
    const roleIds = Array.from(selectedRoles);
    onSave(userId, roleIds);
  };

  const handleCancel = () => {
    if (assignments) {
      const assigned = assignments
        .filter((r) => r.assigned)
        .map((r) => r.id);
      setSelectedRoles(new Set(assigned));
    }
    onOpenChange(false);
  };

  const activeRoles = assignments?.filter((r) => r.status === "active") ?? [];
  const inactiveRoles = assignments?.filter((r) => r.status === "inactive") ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Roles</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-2 space-y-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <p>
                  <span className="font-medium">User:</span> {userName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {userEmail}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading roles...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Active Roles</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeRoles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No active roles available.
                    </p>
                  ) : (
                    activeRoles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-start space-x-3"
                      >
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoles.has(role.id)}
                          onCheckedChange={() => handleToggle(role.id)}
                          disabled={isPending}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="font-medium"
                          >
                            {role.name}
                          </Label>
                          {role.code && (
                            <p className="text-xs text-muted-foreground">
                              Code: {role.code}
                            </p>
                          )}
                          {role.description && (
                            <p className="text-xs text-muted-foreground">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {inactiveRoles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Inactive Roles
                  </Label>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inactiveRoles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-start space-x-3 opacity-60"
                      >
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoles.has(role.id)}
                          onCheckedChange={() => {}}
                          disabled
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="font-medium"
                          >
                            {role.name}
                          </Label>
                          {role.code && (
                            <p className="text-xs text-muted-foreground">
                              Code: {role.code}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !hasChanges || isLoading}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ManageRolesDialog;
