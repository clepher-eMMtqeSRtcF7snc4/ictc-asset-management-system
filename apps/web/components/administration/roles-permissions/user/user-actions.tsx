"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pen, Trash2 } from "lucide-react";

interface UserActionsProps {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

export function UserActions({ user, onEdit, onDelete }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${user.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pen /> Manage Roles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user)}>
          <Trash2 /> Remove Access
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
