"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PermissionFooterProps {
  isSaving: boolean;
  hasChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function PermissionFooter({
  isSaving,
  hasChanges,
  onSave,
  onCancel,
}: PermissionFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t pt-4">
      <Button variant="outline" onClick={onCancel} disabled={isSaving}>
        <ArrowLeft />
        Back to Roles
      </Button>
      <Button onClick={onSave} disabled={isSaving || !hasChanges}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
