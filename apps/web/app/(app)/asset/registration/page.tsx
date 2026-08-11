"use client";

import AssRegContentSection from "@/components/asset-registration/ass-reg-content-section";
import AssRegHeaderSection from "@/components/asset-registration/ass-reg-header-section"
import { AssetCategory, AssetType, Assets, AssetsStats, Departments, FundSource } from "@repo/trpc/schemas";
import { useState } from "react";

const stats: AssetsStats[] = [
  { label: 'Total Assets', value: '2,345', change: '+12 this month', icon: "package", color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Assignments', value: '1,892', change: '80.7% utilization', icon: "activity", color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Pending Requests', value: '23', change: '8 awaiting approval', icon: "clock", color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Under Maintenance', value: '34', change: '3 critical', icon: "alertTriangle", color: 'text-red-600', bg: 'bg-red-50' },
];

const assets: Assets[] = [
  { id: 'AST-2026-000145', name: 'Dell OptiPlex Desktop', category: 'ICT Equipment', dept: 'College of IT', status: 'In Stock', date: 'Jul 5, 2026' },
  { id: 'AST-2026-000144', name: 'Dell P2422H Monitor', category: 'ICT Equipment', dept: 'College of IT', status: 'Assigned', date: 'Jul 5, 2026' },
  { id: 'AST-2026-000143', name: 'APC UPS 650VA', category: 'ICT Equipment', dept: 'Engineering', status: 'In Stock', date: 'Jul 3, 2026' },
  { id: 'AST-2026-000142', name: 'Epson L3250 Printer', category: 'ICT Equipment', dept: 'Registrar', status: 'Assigned', date: 'Jun 28, 2026' },
]

const category: AssetCategory[] = [
  { id:1, label: "Select a category", value: "" },
  { id:2, label: "ICT Equipment", value: "ICT Equipment" },
  { id:3, label: "Furniture", value: "Furniture" },
  { id:4, label: "Laboratory Equipment", value: "Laboratory Equipment" },
  { id:5 ,label: "Vehicle", value: "Vehicle" },
]

const type: AssetType[] = [
  { id:1, label: "Select a type", value: null },
  { id:2, label: "Desktop Computer", value: "Desktop Computer" },
  { id:3, label: "Laptop", value: "Laptop" },
  { id:4, label: "Printer", value: "Printer" },
  { id:5, label: "Projector", value: "Projector" },
]

const fundSource: FundSource[] = [
  { id:0, label: "Select a type", value: null },
  { id:1, label: "General Fund", value: "General Fund" },
  { id:2, label: "CHED", value: "CHED" },
  { id:3, label: "Research Grant", value: "Research Grant" },
]

const departments: Departments[] = [
  { id:1, name: "College of Information Technology", shortCode: "CIT", building: "", room: "", floor: "" },
  { id:2, name: "College of Engineering", shortCode: "COE" },
  { id:3, name: "Registrar", shortCode: "Registrar" },
]

export default function AssetRegistration(){

  const [isCreateFiscalYearOpen, setIsCreateFiscalYearOpen] = useState(false);

   const handleSaveFiscalYear = (data: Assets) => {
    console.log(data);
  }

  // const handleFiscalYearAction = (action: FiscalYearAction, year: number) => {
  //   switch (action) {
  //     case "update":
  //       toast("You updated the following values:", {
  //             description: (
  //               <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
  //                 <code>{JSON.stringify(data, null, 2)}</code>
  //               </pre>
  //             ),
  //             position: "bottom-right",
  //             classNames: {
  //               content: "flex flex-col gap-2",
  //             },
  //             style: {
  //               "--border-radius": "calc(var(--radius)  + 4px)",
  //             } as React.CSSProperties,
  //           })
  //       console.log("Update fiscal year", year);
  //       break;
  //     case "delete":
  //       console.log("Delete fiscal year", year);
  //       break;
  //     case "lock":
  //       console.log("Lock fiscal year", year);
  //       break;
  //     case "complete":
  //       console.log("Complete fiscal year", year);
  //       break;
  //     case "archive":
  //       console.log("Archive fiscal year", year);
  //       break;
  //     default:
  //       console.log("Unknown action", action, year);
  //   }
  // };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AssRegHeaderSection/>

      <AssRegContentSection
        stats={stats}
        assets={assets}
        category={category}
        type={type}
        departments={departments}
        fundSource={fundSource}

        onAction={() => {}}
      />
    </div>
  )
}