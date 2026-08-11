import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArchiveIcon,
  CalendarCheck,
  LockKeyholeIcon,
  MoreHorizontal,
  PenBox,
  Trash2,
} from "lucide-react";
import { FiscalYearAction } from "@repo/trpc/schemas";

const actions = {
  update: {
    label: "Update",
    icon: PenBox,
  },
  delete: {
    label: "Delete",
    icon: Trash2,
    className: "text-destructive",
  },
  lock: {
    label: "Lock",
    icon: LockKeyholeIcon,
  },
  complete: {
    label: "Complete",
    icon: CalendarCheck,
  },
  archive: {
    label: "Archive",
    icon: ArchiveIcon,
  },
} as const;

const actionStatus = {
  planning: ["update", "lock", "delete"],
  implementation: ["update", "lock", "delete"],
  completed: ["lock", "archive"],
  archived: ["archive"],
} as const;

interface ColumnActionProps {
  year: number;
  status: keyof typeof actionStatus;
  onAction: (action: FiscalYearAction, year: number) => void;
}

export default function ColumnAction({ year, status, onAction }: ColumnActionProps) {
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {actionStatus[status].map((actionKey) => {
            const action = actions[actionKey];
            const Icon = action.icon;

            return (
              <DropdownMenuItem
                key={actionKey}
                className={"className" in action ? action.className : undefined}
                onClick={() => onAction(actionKey, year)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

