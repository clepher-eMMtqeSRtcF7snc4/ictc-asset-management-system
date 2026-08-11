"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { FiscalYear, FiscalYearAction } from "@repo/trpc/schemas";

interface FiscalYearContentPageProps {
  data: FiscalYear[];
  onCreateFiscalYear: () => void;
  onAction: (action: FiscalYearAction, year: number) => void;
}

export default function FiscalYearContentSection({ 
  data,
  onCreateFiscalYear,
  onAction,
}: FiscalYearContentPageProps) {
  return (
    <div className="">
      <Card className="shadow-md">
        <CardContent className="">
          <DataTable columns={createColumns(onAction)} data={data} onCreateFiscalYear={onCreateFiscalYear}/>
        </CardContent>
      </Card>
    </div>
  );
}