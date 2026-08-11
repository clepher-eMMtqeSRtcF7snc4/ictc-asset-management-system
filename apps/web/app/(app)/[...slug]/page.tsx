import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowRight,
  ClipboardCheck,
  FilePlus2,
  Filter,
  PackageCheck,
  Search,
} from "lucide-react"
import Link from "next/link"

type ModuleDefinition = {
  title: string
  description: string
  action: string
  workflow: string[]
  metrics: { label: string; value: string; detail: string }[]
}

const modules: Record<string, ModuleDefinition> = {
  assets: {
    title: "Assets",
    description: "Manage individually tracked ICT equipment throughout its lifecycle.",
    action: "Add asset",
    workflow: ["Register", "Tag", "Assign", "Maintain", "Verify", "Dispose"],
    metrics: [
      { label: "Available", value: "256", detail: "Ready for assignment" },
      { label: "In use", value: "1,892", detail: "Assigned to custodians" },
      { label: "For review", value: "34", detail: "Under maintenance" },
    ],
  },
  inventory: {
    title: "Inventory",
    description: "Track consumables, stock levels, issuances, and replenishment.",
    action: "Add inventory item",
    workflow: ["Receive", "Stock in", "Issue", "Adjust", "Count", "Reorder"],
    metrics: [
      { label: "In stock", value: "684", detail: "Items above minimum level" },
      { label: "Low stock", value: "42", detail: "Require replenishment" },
      { label: "Out of stock", value: "11", detail: "No available units" },
    ],
  },
  procurement: {
    title: "Procurement",
    description: "Create, review, approve, and track purchase requests and orders.",
    action: "Create purchase request",
    workflow: ["Draft", "Submit", "Review", "Approve", "Order", "Receive"],
    metrics: [
      { label: "Draft", value: "8", detail: "Awaiting submission" },
      { label: "Under review", value: "12", detail: "Pending approval" },
      { label: "Ordered", value: "6", detail: "Expected deliveries" },
    ],
  },
  receiving: {
    title: "Receiving",
    description: "Receive deliveries, inspect items, and route them to assets or inventory.",
    action: "Receive delivery",
    workflow: ["Purchase order", "Delivery", "Receive", "Inspect", "Accept", "Classify"],
    metrics: [
      { label: "Expected", value: "14", detail: "Open deliveries" },
      { label: "In inspection", value: "3", detail: "Awaiting acceptance" },
      { label: "Completed", value: "42", detail: "This fiscal year" },
    ],
  },
  verification: {
    title: "Physical Verification",
    description: "Verify asset presence and condition, then resolve discrepancies.",
    action: "Start inventory count",
    workflow: ["Create count", "Select location", "Scan assets", "Verify", "Resolve", "Finalize"],
    metrics: [
      { label: "Expected", value: "2,345", detail: "Assets in current scope" },
      { label: "Verified", value: "2,270", detail: "96.8% completed" },
      { label: "Discrepancies", value: "75", detail: "Require follow-up" },
    ],
  },
  maintenance: {
    title: "Maintenance",
    description: "Manage requests, technician work, repairs, testing, and asset return.",
    action: "Create maintenance request",
    workflow: ["Request", "Inspect", "Diagnose", "Repair", "Test", "Return"],
    metrics: [
      { label: "Open", value: "17", detail: "Awaiting assignment" },
      { label: "In progress", value: "14", detail: "With ICT technicians" },
      { label: "Overdue", value: "3", detail: "Need escalation" },
    ],
  },
  reports: {
    title: "Reports",
    description: "Generate operational, financial, and audit-ready asset reports.",
    action: "Generate report",
    workflow: ["Choose report", "Set filters", "Preview", "Export", "Print"],
    metrics: [
      { label: "Asset reports", value: "6", detail: "Registry and valuation" },
      { label: "Inventory reports", value: "5", detail: "Stock and issuance" },
      { label: "Scheduled", value: "4", detail: "Recurring deliveries" },
    ],
  },
}

function getModule(slug: string[]): ModuleDefinition {
  const root = slug[0] ?? "assets"
  return modules[root] ?? {
    title: slug.at(-1)?.split("-").map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`).join(" ") ?? "Workspace",
    description: "Use this workspace to complete the current ICT asset management workflow.",
    action: "Create record",
    workflow: ["Create", "Review", "Approve", "Complete"],
    metrics: [
      { label: "Open items", value: "12", detail: "Require action" },
      { label: "In progress", value: "8", detail: "Being processed" },
      { label: "Completed", value: "24", detail: "This fiscal year" },
    ],
  }
}

export default async function ModulePage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const module = getModule(slug)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><Link href="/dashboard">Dashboard</Link></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{module.title}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{module.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{module.description}</p>
        </div>
        <Button><FilePlus2 />{module.action}</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {module.metrics.map((metric, index) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${[82, 56, 34][index]}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Workflow</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Follow the controlled process to maintain complete records and audit history.</p>
          </div>
          <Badge variant="info"><ClipboardCheck /> Guided process</Badge>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-2 lg:flex-row lg:items-center">
            {module.workflow.map((step, index) => (
              <li key={step} className="flex min-w-0 flex-1 items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{index + 1}</span>
                <span className="text-sm font-medium">{step}</span>
                {index < module.workflow.length - 1 && <ArrowRight className="ml-auto hidden size-4 text-muted-foreground lg:block" />}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Records</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Search, filter, review, and act on current records.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline"><Filter /> Filters</Button>
            <Button size="sm" variant="outline"><Search /> Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed py-14 text-center">
            <PackageCheck className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Your {module.title.toLowerCase()} workspace is ready</p>
            <p className="mt-1 text-sm text-muted-foreground">Create a record to begin this workflow.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
