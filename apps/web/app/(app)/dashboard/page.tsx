"use client"

import DashboardContentSection from '@/components/dashboard/dashboard-content-section'
import DashboardHeaderSection from '@/components/dashboard/dashboard-header-section'
import { DashboardAssetsByStatus, DashboardPendingApprovals, DashboardRecentActivity, DashBoardStats } from '@repo/trpc/schemas';

const handleDashboardYearAction = (year: number) => {
    console.log(year);
  };

const stats: DashBoardStats[] = [
  { label: 'Total Assets', value: '2,345', change: '+12 this month', icon: "package", color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Assignments', value: '1,892', change: '80.7% utilization', icon: "activity", color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Pending Requests', value: '23', change: '8 awaiting approval', icon: "clock", color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Under Maintenance', value: '34', change: '3 critical', icon: "alertTriangle", color: 'text-red-600', bg: 'bg-red-50' },
];

const recentActivity:DashboardRecentActivity[] = [
  { action: 'Asset Registered', detail: 'Dell OptiPlex 7090 — AST-2026-000145', time: '2 min ago', type: 'success' },
  { action: 'Transfer Approved', detail: 'Laptop to College of Engineering', time: '18 min ago', type: 'info' },
  { action: 'Disposal Request', detail: 'HP ProDesk 490 — ICT-2021-00045', time: '1 hr ago', type: 'warning' },
  { action: 'Purchase Request', detail: 'PR-2026-0001 submitted for approval', time: '2 hrs ago', type: 'info' },
  { action: 'Audit Completed', detail: 'College of IT — 96.8% compliance', time: '3 hrs ago', type: 'success' },
  { action: 'Asset Assigned', detail: 'Projector to Room 304 — ASN-2026-00045', time: '5 hrs ago', type: 'success' },
]

const assetsByStatus: DashboardAssetsByStatus[] = [
  { label: 'Available', count: 256, total: 2345, color: 'bg-green-500' },
  { label: 'Assigned / In Use', count: 1892, total: 2345, color: 'bg-blue-500' },
  { label: 'Under Maintenance', count: 34, total: 2345, color: 'bg-amber-500' },
  { label: 'Reserved', count: 105, total: 2345, color: 'bg-purple-500' },
  { label: 'Disposed', count: 58, total: 2345, color: 'bg-gray-400' },
]

const pendingApprovals: DashboardPendingApprovals[] = [
  { id: 'PR-2026-0001', type: 'Purchase Request', dept: 'College of Engineering', amount: '₱1,195,000', step: 'Budget Office', urgent: true },
  { id: 'TR-2026-0032', type: 'Transfer Request', dept: 'IT Center → Registrar', amount: '—', step: 'Dept. Head', urgent: false },
  { id: 'DR-2026-0008', type: 'Disposal Request', dept: 'ICT Office', amount: '₱0', step: 'Accounting', urgent: true },
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
        onAction={handleDashboardYearAction}
      />
    </div>
  )
}
