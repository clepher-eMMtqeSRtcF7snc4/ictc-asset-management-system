"use client";

import FiscalDialog from "@/components/master-data/fiscal-year/fiscal-dialog";
import FiscalYearContentSection from "@/components/master-data/fiscal-year/fiscal-year-content-section";
import FiscalYearHeaderSection from "@/components/master-data/fiscal-year/fiscal-year-header-section";
import { FiscalYear, FiscalYearAction, FiscalYearInput } from "@repo/trpc/schemas";
import { useState } from "react";
import { toast } from "sonner";

const data: FiscalYear[] = [
  {
    year: 2027,
    status: "planning",
    fundSource: "Source A",
    budget: 1195000,
    planningStartPeriod: "Jan 2027",
    planningEndPeriod: "Mar 2027",
    implementationStartPeriod: "Apr 2027",
    implementationEndPeriod: "Dec 2027",
    finalSubmission: "Jul 15, 2027",
  },
  {
    year: 2026,
    status: "implementation",
    fundSource: "Source B",
    budget: 430000,
    planningStartPeriod: "Jan 2026",
    planningEndPeriod: "Mar 2026",
    implementationStartPeriod: "Jan 2026",
    implementationEndPeriod: "Dec 2026",
    finalSubmission: "Jul 18, 2026",
  },
  {
    year: 2025,
    status: "completed",
    fundSource: "Source C",
    budget: 85000,
    planningStartPeriod: "Jan 2025",
    planningEndPeriod: "Mar 2025",
    implementationStartPeriod: "Jan 2025",
    implementationEndPeriod: "Sep 2025",
    finalSubmission: "Jul 22, 2025",
  },
  {
    year: 2024,
    status: "archived",
    fundSource: "Source D",
    budget: 620000,
    planningStartPeriod: "Jan 2024",
    planningEndPeriod: "Mar 2024",
    implementationStartPeriod: "Apr 2024",
    implementationEndPeriod: "Jun 2024",
    finalSubmission: "Jul 10, 2024",
  },
];

const summary = ['FY 2026', 'GAA', '524,031,000.00', '26,201,550.00']

export default function FiscalYearPage() {
  const [isCreateFiscalYearOpen, setIsCreateFiscalYearOpen] = useState(false);

   const handleSaveFiscalYear = (data: FiscalYearInput) => {
    console.log(data);
  }

  const handleFiscalYearAction = (action: FiscalYearAction, year: number) => {
    switch (action) {
      case "update":
        toast("You updated the following values:", {
              description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
                  <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
              ),
              position: "bottom-right",
              classNames: {
                content: "flex flex-col gap-2",
              },
              style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
              } as React.CSSProperties,
            })
        console.log("Update fiscal year", year);
        break;
      case "delete":
        console.log("Delete fiscal year", year);
        break;
      case "lock":
        console.log("Lock fiscal year", year);
        break;
      case "complete":
        console.log("Complete fiscal year", year);
        break;
      case "archive":
        console.log("Archive fiscal year", year);
        break;
      default:
        console.log("Unknown action", action, year);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FiscalYearHeaderSection summary={summary}/>

      <FiscalYearContentSection 
      data={data} 
      onCreateFiscalYear={() => setIsCreateFiscalYearOpen(true)}
      onAction={handleFiscalYearAction} 
      />
      
      <FiscalDialog
        open={isCreateFiscalYearOpen}
        onOpenChange={setIsCreateFiscalYearOpen}
        onSave={handleSaveFiscalYear}
      />
    </div>
  );
}
