"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  DashboardAssetsByStatus,
  DashboardPendingApprovals,
  DashboardRecentActivity,
  DashBoardStats,
} from "@repo/trpc/schemas"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Package,
  Wrench,
} from "lucide-react"
import Link from "next/link"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

interface DashboardContentPageProps {
  stats: DashBoardStats[]
  recentActivity: DashboardRecentActivity[]
  assetsByStatus: DashboardAssetsByStatus[]
  pendingApprovals: DashboardPendingApprovals[]
}

const iconMap = {
  package: Package,
  activity: Activity,
  clock: Clock3,
  alertTriangle: AlertTriangle,
  boxes: Boxes,
  checkCircle: CheckCircle2,
  circleDollar: CircleDollarSign,
  wrench: Wrench,
} as const

const assetCategoryData = [
  { category: "Computers", assets: 912 },
  { category: "Networking", assets: 376 },
  { category: "Printers", assets: 248 },
  { category: "Servers", assets: 91 },
  { category: "Peripherals", assets: 718 },
]

const acquisitionData = [
  { month: "Jan", assets: 34 },
  { month: "Feb", assets: 48 },
  { month: "Mar", assets: 39 },
  { month: "Apr", assets: 58 },
  { month: "May", assets: 52 },
  { month: "Jun", assets: 71 },
  { month: "Jul", assets: 64 },
  { month: "Aug", assets: 79 },
]

const inventoryData = [
  { status: "In stock", items: 684, fill: "var(--color-inStock)" },
  { status: "Low stock", items: 42, fill: "var(--color-lowStock)" },
  { status: "Out of stock", items: 11, fill: "var(--color-outOfStock)" },
]

const assetStatusConfig = {
  value: { label: "Assets" },
  available: { label: "Available", color: "#22c55e" },
  inUse: { label: "In use", color: "#3b82f6" },
  maintenance: { label: "Maintenance", color: "#f59e0b" },
  damaged: { label: "Damaged", color: "#ef4444" },
  disposed: { label: "Disposed", color: "#94a3b8" },
} satisfies ChartConfig

const categoryConfig = {
  assets: { label: "Assets", color: "#2386b8" },
} satisfies ChartConfig

const acquisitionConfig = {
  assets: { label: "Assets acquired", color: "#2386b8" },
} satisfies ChartConfig

const inventoryConfig = {
  items: { label: "Items" },
  inStock: { label: "In stock", color: "#22c55e" },
  lowStock: { label: "Low stock", color: "#f59e0b" },
  outOfStock: { label: "Out of stock", color: "#ef4444" },
} satisfies ChartConfig

export default function DashboardContentSection({
  stats,
  recentActivity,
  assetsByStatus,
  pendingApprovals,
}: DashboardContentPageProps) {
  const statusPieData = assetsByStatus.map((status) => ({
    name: status.label,
    value: status.count,
    fill:
      status.label === "Available"
        ? "#22c55e"
        : status.label.includes("Use")
          ? "#3b82f6"
          : status.label.includes("Maintenance")
            ? "#f59e0b"
            : status.label === "Damaged"
              ? "#ef4444"
              : "#94a3b8",
  }))

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? Package
          return (
            <Card key={stat.label} className="shadow-none">
              <CardContent className="flex items-start justify-between p-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-md ${stat.bg}`}>
                  <Icon className={`size-4 ${stat.color}`} aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <div>
              <CardTitle>Asset status distribution</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">2,345 individually tracked assets</p>
            </div>
            <Badge variant="outline">FY 2026</Badge>
          </CardHeader>
          <CardContent className="grid items-center gap-2 pt-2 sm:grid-cols-[1fr_0.9fr]">
            <ChartContainer config={assetStatusConfig} className="mx-auto aspect-square max-h-52">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={statusPieData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={2}>
                  {statusPieData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="space-y-2">
              {assetsByStatus.map((status) => (
                <div key={status.label} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <span className={`size-2 shrink-0 rounded-full ${status.color}`} />
                    <span className="truncate">{status.label}</span>
                  </span>
                  <span className="font-medium tabular-nums">{status.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader className="pb-1">
            <CardTitle>Asset acquisition trend</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Assets registered by month</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={acquisitionConfig} className="h-56 w-full">
              <LineChart data={acquisitionData} margin={{ left: -12, right: 8, top: 16 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="assets" stroke="var(--color-assets)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader className="pb-1">
            <CardTitle>Assets by category</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Distribution across ICT asset classes</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="h-56 w-full">
              <BarChart data={assetCategoryData} margin={{ left: -12, right: 8, top: 16 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="assets" fill="var(--color-assets)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <div>
              <CardTitle>Inventory stock overview</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Current item availability</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/inventory">View inventory <ArrowRight /></Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            <ChartContainer config={inventoryConfig} className="h-40 w-full">
              <BarChart data={inventoryData} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} width={88} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="items" radius={4}>
                  {inventoryData.map((entry) => <Cell key={entry.status} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Latest asset, inventory, and request updates</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/administration/audit-logs">View audit log <ArrowRight /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((activity) => (
              <div key={`${activity.action}-${activity.time}`} className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/60">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${
                  activity.type === "success" ? "bg-green-500" : activity.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="truncate text-xs text-muted-foreground">{activity.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Pending actions</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Items requiring review or follow-up</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-medium text-primary">{approval.id}</p>
                    <p className="mt-1 text-sm font-medium">{approval.type}</p>
                    <p className="truncate text-xs text-muted-foreground">{approval.dept}</p>
                  </div>
                  <Badge variant={approval.urgent ? "warning" : "secondary"}>{approval.step}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-medium">{approval.amount}</span>
                  <Button variant="ghost" size="xs">Review <ArrowRight /></Button>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-md bg-success p-3 text-xs text-success-foreground">
              <CheckCircle2 className="size-4 shrink-0" />
              96.8% of assets have been verified this cycle.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
