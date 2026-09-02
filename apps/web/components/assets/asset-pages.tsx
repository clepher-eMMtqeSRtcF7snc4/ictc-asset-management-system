import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  ClipboardSignature,
  Laptop,
  MapPin,
  PackagePlus,
  RotateCcw,
  SendHorizontal,
} from "lucide-react";
import Link from "next/link";

const assets: [string, string, string, string, string][] = [
  [
    "AST-2026-000145",
    "Dell Latitude 5450",
    "Laptop",
    "John Dela Cruz",
    "In Use",
  ],
  [
    "AST-2026-000144",
    "Dell P2422H Monitor",
    "Peripheral",
    "ICT Stockroom",
    "Available",
  ],
  [
    "AST-2026-000143",
    "APC UPS 650VA",
    "Power Equipment",
    "Engineering Lab",
    "Under Maintenance",
  ],
];

const statusVariant = (status: string) =>
  status === "Available" ? "success" : status === "In Use" ? "info" : "warning";

export function AssetListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Track individually identified ICT equipment, custodians, locations, and lifecycle status."
        action={
          <Button asChild>
            <Link href="/assets/registration">
              <PackagePlus /> Add asset
            </Link>
          </Button>
        }
      />
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["2,345", "Total assets"],
          ["256", "Available for assignment"],
          ["₱48.6M", "Acquisition value"],
        ].map(([value, label]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Asset registry</CardTitle>
          <Button size="sm" variant="outline">
            Filter assets
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs text-muted-foreground">
                <tr>
                  {[
                    "Asset tag",
                    "Asset",
                    "Category",
                    "Assigned to / Location",
                    "Status",
                    "",
                  ].map((heading) => (
                    <th key={heading} className="p-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assets.map(([tag, name, category, holder, status]) => (
                  <tr key={tag} className="border-b">
                    <td className="p-3 font-mono text-xs text-primary">
                      {tag}
                    </td>
                    <td className="p-3 font-medium">{name}</td>
                    <td className="p-3">{category}</td>
                    <td className="p-3">{holder}</td>
                    <td className="p-3">
                      <Badge variant={statusVariant(status)}>{status}</Badge>
                    </td>
                    <td className="p-3">
                      <Button asChild size="xs" variant="ghost">
                        <Link href={`/assets/${tag}`}>
                          <ArrowRight /> View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function AssetLaptopPreview() {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <div className="relative mx-auto h-[220px] w-full max-w-[450px]">
        <div className="absolute left-1/2 top-6 h-28 w-72 -translate-x-1/2 rounded-[18px] border-[10px] border-slate-300 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-400 shadow-[0_18px_35px_rgba(15,23,42,0.18)]">
          <div className="absolute inset-2 rounded-[10px] bg-gradient-to-b from-slate-600 via-slate-500 to-slate-300">
            <div className="absolute inset-x-5 top-5 h-2 rounded-full bg-slate-300/80" />
            <div className="absolute inset-x-10 bottom-5 h-20 rounded-xl border border-white/10 bg-slate-700/70" />
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 h-4 w-[280px] -translate-x-1/2 rounded-b-[16px] border border-slate-300 bg-slate-300/80 shadow-inner" />
        <div className="absolute bottom-2 left-1/2 h-3 w-[320px] -translate-x-1/2 rounded-full bg-slate-300/80" />
      </div>
      <div className="mt-3 flex justify-center">
        <Button variant="outline" size="sm" className="rounded-md bg-background">
          View Full Size
        </Button>
      </div>
    </div>
  );
}

function PropertyStickerCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="rounded-md border-2 border-dashed border-border bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-amber-100 text-xs font-bold text-amber-900">
              M
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Republic of the Philippines
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground">
                Property Inventory
              </p>
            </div>
          </div>
          <div className="h-10 w-10 rounded-md border border-border bg-white" />
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-4 text-[11px] text-foreground">
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground">Property Number</p>
              <p className="font-semibold">MSU-ICT-2026-000123</p>
            </div>
            <div>
              <p className="text-muted-foreground">Property Description</p>
              <p className="font-semibold">Dell Latitude 5440 Laptop</p>
            </div>
            <div>
              <p className="text-muted-foreground">Model Number</p>
              <p className="font-semibold">Latitude 5440</p>
            </div>
            <div>
              <p className="text-muted-foreground">Serial Number</p>
              <p className="font-semibold">DL5440-8F72K91</p>
            </div>
            <div>
              <p className="text-muted-foreground">Acquisition Date</p>
              <p className="font-semibold">08/02/2026</p>
            </div>
            <div>
              <p className="text-muted-foreground">Reference (PO No.)</p>
              <p className="font-semibold">PO-2026-00125</p>
            </div>
            <div>
              <p className="text-muted-foreground">Person Accountable</p>
              <p className="font-semibold">Judan, Clepher</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2">
            <div className="grid h-20 w-20 place-items-center rounded-md border border-border bg-white text-[8px] font-bold text-foreground">
              QR
            </div>
            <div className="text-center text-[9px] uppercase text-muted-foreground">
              Scan to view
              <br />
              details
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-[10px] text-muted-foreground">
          <p className="font-semibold uppercase text-foreground">Note</p>
          <p className="mt-1">Unauthorized removal or tampering will be subject to disciplinary action.</p>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-center text-[10px] text-muted-foreground">
          <div className="h-10 border-b border-dashed border-border" />
          <p className="mt-1 uppercase tracking-[0.18em]">Signature</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary">
        <span>Print / Save as PDF</span>
      </div>
    </div>
  );
}

function QuickActionsCard() {
  const actions = [
    { label: "Edit Asset", icon: "✎" },
    { label: "Reassign Asset", icon: "⇄" },
    { label: "Create Maintenance Request", icon: "＋" },
    { label: "Generate New Sticker", icon: "◫" },
    { label: "Mark as Under Maintenance", icon: "◌" },
    { label: "Retire / Dispose Asset", icon: "⌫" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-base font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="space-y-2 p-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex w-full items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-left text-sm text-foreground transition hover:bg-muted/40"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-background text-sm">
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AssignmentHistoryTable() {
  const rows = [
    {
      assignedTo: "Judan, Clepher",
      department: "Information Communication Technology Center (ICTC)",
      building: "Training Student Activity Center",
      room: "ICTC Support Office",
      dateAssigned: "Sep 2, 2026",
      dateReleased: "-",
      assignedBy: "System",
      remarks: "Initial assignment",
      status: "Current",
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-[0.08em] text-muted-foreground">
          <tr>
            {[
              "Assigned To",
              "Department",
              "Building / Room",
              "Date Assigned",
              "Date Released",
              "Assigned By",
              "Remarks",
            ].map((header) => (
              <th key={header} className="px-3 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.assignedTo} className="border-t border-border bg-card align-top">
              <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                    JC
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{row.assignedTo}</p>
                    <p className="text-xs text-muted-foreground">Administrative Officer II</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-muted-foreground">{row.department}</td>
              <td className="px-3 py-3 text-muted-foreground">
                {row.building}
                <br />
                {row.room}
              </td>
              <td className="px-3 py-3 text-muted-foreground">{row.dateAssigned}</td>
              <td className="px-3 py-3 text-muted-foreground">{row.dateReleased}</td>
              <td className="px-3 py-3 text-muted-foreground">{row.assignedBy}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-success-border bg-success px-2 py-0.5 text-[10px] font-medium text-success-foreground">
                    {row.status}
                  </span>
                  <span className="text-muted-foreground">{row.remarks}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AssetDetailPage({ assetId }: { assetId: string }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Details"
        description="View complete information, assignment summary, and history of this asset."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-md">
              Actions
            </Button>
            <Button className="rounded-md">Edit Asset</Button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.6fr_0.95fr]">
        <div className="space-y-5">
          <SectionCard
            title="Basic Information"
            action={<Badge variant="success">Active</Badge>}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Asset Name" value="Dell Latitude 5440 Laptop" />
              <InfoRow label="Condition" value={<span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500" />Good</span>} />
              <InfoRow label="Asset Type" value="Laptop" />
              <InfoRow label="Quantity" value="1" />
              <InfoRow label="Category" value="Computer Equipment" />
              <InfoRow label="Serial Number" value="DL5440-8F72K91" />
              <InfoRow label="Brand" value="Dell" />
              <InfoRow label="Property Number" value="MSU-ICT-2026-000123" />
              <InfoRow label="Model" value="Latitude 5440" />
               <InfoRow label="QR Code / Asset Link" value="https://ict.msua.edu.ph/assets/DL5440-8F72K91" />
              <div className="md:col-span-2">
                <InfoRow
                  label="Description"
                  value="Business laptop assigned for administrative and office productivity tasks."
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Acquisition Information">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Acquisition Date" value="September 2, 2026" />
              <InfoRow label="Purchase Order No." value="PO-2026-00125" />
              <InfoRow label="Acquisition Cost" value="₱ 68,500.00" />
              <InfoRow label="Warranty" value="2 Years" />
              <InfoRow label="Supplier" value="ABC Office Solutions Inc." />
              <InfoRow
                label="Supporting Documents"
                value={
                  <span className="inline-flex items-center gap-2 text-primary">
                    GSIS Online Enrollment.pdf
                  </span>
                }
              />
            </div>
          </SectionCard>

          <SectionCard title="Assignment Summary">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Department" value="Information Communication Technology" />
              <InfoRow
                label="Assigned To (Custodian)"
                value={
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      JC
                    </div>
                    <div>
                      <p className="font-medium">Judan, Clepher</p>
                      <p className="text-xs text-muted-foreground">Administrative Officer II</p>
                    </div>
                  </div>
                }
              />
              <InfoRow label="Building" value="Training Student Activity Center" />
              <InfoRow label="Room" value="ICTC Support Office" />
            </div>

            <div className="mt-4 rounded-md border border-info-border bg-info/10 p-3 text-sm text-foreground">
              <div className="flex items-center gap-2 font-medium">
                <span className="rounded-md bg-info px-2 py-0.5 text-[10px] text-info-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                </span>
                September 2, 2026
              </div>
              <p className="mt-2 text-muted-foreground">(0 days)</p>
            </div>
          </SectionCard>

          <SectionCard title="Assignment History">
            <AssignmentHistoryTable />
          </SectionCard>

          <SectionCard title="System Information">
            <div className="grid gap-4 md:grid-cols-4">
              <InfoRow label="Status" value={<span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500" />Active</span>} />
              <InfoRow label="Created At" value="Sep 2, 2026 10:15 AM" />
              <InfoRow label="Created By" value="System Admin" />
              <InfoRow label="Updated At" value="Sep 2, 2026 10:15 AM" />
              <InfoRow label="Updated By" value="System Admin" />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Asset Photo</p>
            </div>
            <AssetLaptopPreview />
          </div>

          <PropertyStickerCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}

export function AssetAssignmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Assignment"
        description="Assign an available asset and establish employee accountability."
      />
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {[
              "Select available asset",
              "Select employee",
              "Set department & location",
              "Confirm accountability",
            ].map((step, index) => (
              <div key={step} className="flex flex-1 items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{step}</span>
                {index < 3 && (
                  <ArrowRight className="ml-auto hidden size-4 text-muted-foreground lg:block" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md border bg-muted/30 p-4 text-sm">
            <strong>Dell P2422H Monitor</strong> is available. The selected
            employee becomes responsible for this asset after confirmation.
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              <ClipboardSignature /> Generate accountability document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AssetTransferPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Transfer"
        description="Move custody or location while retaining the complete asset history."
      />
      <Card>
        <CardHeader>
          <CardTitle>Transfer request TR-2026-0032</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Current custodian</p>
            <p className="font-medium">ICT Center · John Dela Cruz</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Proposed custodian</p>
            <p className="font-medium">Registrar · Maria Santos</p>
          </div>
          <div className="md:col-span-2 flex justify-between rounded-md bg-muted/50 p-3 text-sm">
            <span>Awaiting Department Head approval</span>
            <Badge variant="warning">Pending</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AssetReturnPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Returns"
        description="Record condition checks and return assets to stock or maintenance."
      />
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Locate assigned asset"],
              ["2", "Inspect condition"],
              ["3", "Return to stock or maintenance"],
            ].map(([number, step]) => (
              <div key={number} className="rounded-md border p-4">
                <span className="text-primary font-semibold">{number}</span>
                <p className="mt-2 font-medium">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="outline">
              <RotateCcw /> Start return inspection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
