"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiscalYear, FiscalYearAction } from "@repo/trpc/schemas";
import { cn } from "@/lib/utils";
import ColumnAction from "./column-action";

const statusBadge = (s: string) => {
  const map: Record<string, "warning" | "info" | "success" | "outline"> = {
    planning: "warning",
    implementation: "info",
    completed: "success",
    archived: "outline",
  };

  return <Badge variant={map[s] || "default"}>{s}</Badge>;
};

const statusType = (s: string) => {
  return s === "implementation" ? false : true;
};

export const createColumns = (
  onAction: (action: FiscalYearAction, year: number) => void
): ColumnDef<FiscalYear>[] => [
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const year = row.getValue("year") as number;
      return (
        <div className={cn("font-semibold", statusType(status) && "text-muted-foreground")}>
          {year}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return statusBadge(status);
    },
  },
  {
    accessorKey: "fundSource",
    header: () => "Fund Source",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const fundSource = row.getValue("fundSource") as string;

      return <div className={cn(statusType(status) && "text-muted-foreground")}>{fundSource}</div>;
    },
  },
  {
    accessorKey: "budget",
    header: () => "Budget",
    cell: ({ row }) => {
      const budget = row.getValue("budget") as number;
      const status = row.getValue("status") as string;

      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(budget);

      return <div className={cn(statusType(status) && "text-muted-foreground")}>{formatted}</div>;
    },
  },
  {
    accessorKey: "planningStartPeriod",
    header: () => "Planning Period",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const period = row.original.planningStartPeriod + " - " + row.original.planningEndPeriod;
      return <div className={cn(statusType(status) && "text-muted-foreground")}>{period}</div>;
    },
  },
  {
    accessorKey: "implementationStartPeriod",
    header: () => "Implementation Period",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const period = row.original.implementationStartPeriod + " - " + row.original.implementationEndPeriod;
      return <div className={cn(statusType(status) && "text-muted-foreground")}>{period}</div>;
    },
  },
  {
    accessorKey: "finalSubmission",
    header: () => "Submission Deadline",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const finalSubmission = row.getValue("finalSubmission") as string;
      return <div className={cn(statusType(status) && "text-muted-foreground")}>{finalSubmission}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <ColumnAction year={data.year} status={data.status} onAction={onAction} />;
    },
  },
];