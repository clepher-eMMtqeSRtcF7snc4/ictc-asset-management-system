import DashboardContentSection from "@/components/dashboard/dashboard-content-section"
import DashboardHeaderSection from "@/components/dashboard/dashboard-header-section"
import {
  DashboardAssetsByStatus,
  DashboardPendingApprovals,
  DashboardRecentActivity,
  DashBoardStats,
} from "@repo/trpc/schemas"

const stats: DashBoardStats[] = [
  { label: "Total assets", value: "2,345", change: "+5.2% this year", icon: "package", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
  { label: "Assets in use", value: "1,892", change: "80.7% utilization", icon: "activity", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
  { label: "Available assets", value: "256", change: "Ready for assignment", icon: "checkCircle", color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950" },
  { label: "Under maintenance", value: "34", change: "3 require attention", icon: "wrench", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  { label: "Inventory items", value: "737", change: "12,846 units in stock", icon: "boxes", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
  { label: "Low stock items", value: "42", change: "11 are out of stock", icon: "alertTriangle", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950" },
  { label: "Total asset value", value: "₱48.6M", change: "Book value: ₱31.4M", icon: "circleDollar", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
  { label: "Pending requests", value: "23", change: "8 awaiting approval", icon: "clock", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
]

const recentActivity: DashboardRecentActivity[] = [
  { action: "Asset assigned", detail: "Dell Latitude 5450 (AST-2026-000145) assigned to John Dela Cruz", time: "12 min ago", type: "success" },
  { action: "Inventory issued", detail: "15 HDMI Cables issued to College of Computing", time: "35 min ago", type: "info" },
  { action: "Maintenance completed", detail: "Epson L3250 (AST-2024-000082) returned to service", time: "1 hr ago", type: "success" },
  { action: "Low stock detected", detail: "USB-C adapters reached their minimum stock level", time: "2 hrs ago", type: "warning" },
  { action: "Delivery received", detail: "DR-2026-0018 received from TechSource Philippines", time: "3 hrs ago", type: "info" },
]

const assetsByStatus: DashboardAssetsByStatus[] = [
  { label: "In Use", count: 1892, total: 2345, color: "bg-blue-500" },
  { label: "Available", count: 256, total: 2345, color: "bg-green-500" },
  { label: "Under Maintenance", count: 34, total: 2345, color: "bg-amber-500" },
  { label: "Damaged", count: 18, total: 2345, color: "bg-red-500" },
  { label: "Disposed", count: 145, total: 2345, color: "bg-slate-400" },
]

const pendingApprovals: DashboardPendingApprovals[] = [
  { id: "PR-2026-0001", type: "Purchase request", dept: "College of Engineering", amount: "₱1,195,000", step: "Budget Office", urgent: true },
  { id: "TR-2026-0032", type: "Asset transfer", dept: "ICT Center → Registrar", amount: "—", step: "Dept. Head", urgent: false },
  { id: "MR-2026-0047", type: "Maintenance request", dept: "College of Computing", amount: "₱8,500", step: "ICT Technician", urgent: true },
]

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <DashboardHeaderSection />
      <DashboardContentSection
        stats={stats}
        recentActivity={recentActivity}
        assetsByStatus={assetsByStatus}
        pendingApprovals={pendingApprovals}
      />
    </div>
  )
}
