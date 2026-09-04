"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Undo } from "lucide-react";

interface PermissionSaveBarProps {
  hasChanges: boolean;
  isSaving: boolean;
  assignedCount: number;
  onSave: () => void;
  onCancel: () => void;
  onDiscard: () => void;
}

export function PermissionSaveBar({
  hasChanges,
  isSaving,
  assignedCount,
  onSave,
  onCancel,
  onDiscard,
}: PermissionSaveBarProps) {
  return (
    <div className="sticky bottom-0 z-10 space-y-3 pb-6">
      {hasChanges && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-2.5 text-sm text-amber-800">
          <svg
            className="h-4 w-4 shrink-0 text-amber-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.299-2.078 3.797-1.857 1.735.252 3.023 1.536 3.388 3.193.27.124.542.268.814.407.26-.71.612-1.4 1.077-2.031.23-.303.51-.593.827-.847a.75.75 0 0 1 1.06 1.06 4.998 4.998 0 0 1-.65 3.35l.023.037v1h.037a2.75 2.75 0 0 1 3.425 2.572 1.75 1.75 0 0 1-1.238 1.678l-.011.025v3.5a1.75 1.75 0 0 1-1.75 1.75h-2.5a2 2 0 0 1-1.96-2.285c.12-.561.587-1.013 1.162-1.18a2.25 2.25 0 0 1 .701-1.379 3 3 0 0 0-.36-1.412 2.75 2.75 0 0 1-.063-2.732 4.5 4.5 0 0 0 2.13-2.57 1 1 0 0 0-.258-1.327l-.004-.003-.006-.003a1 1 0 0 0-1.32.26c-.334.5-1.184 1.248-1.72 1.657.083.415.121.842.121 1.274v3.5h-1v-3.5a6.25 6.25 0 0 0-1.5-4.25 6.25 6.25 0 0 0-2.25-1.5v-.037l-.037-.023a3.75 3.75 0 0 0-4.475-3.166 3.75 3.75 0 0 0-1.682 1.184L3.5 2.56a.75.75 0 0 0 1.06 1.06c.317-.316.659-.593 1.032-.816a2.25 2.25 0 0 1 2.4 0Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">You have unsaved changes.</span>
          <span className="flex-1">
            Make sure to save your changes before leaving this page.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {assignedCount} permission{assignedCount !== 1 ? "s" : ""} assigned
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            size="sm"
          >
            <ArrowLeft /> Back to Roles
          </Button>
          {hasChanges && (
            <Button
              variant="outline"
              onClick={onDiscard}
              disabled={isSaving}
              size="sm"
            >
              <Undo /> Discard Changes
            </Button>
          )}
          <Button onClick={onSave} disabled={isSaving || !hasChanges}>
            <Save />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
