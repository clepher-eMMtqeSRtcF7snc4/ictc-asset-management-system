"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardAssetsByStatus, DashboardPendingApprovals, DashboardRecentActivity, DashBoardStats } from "@repo/trpc/schemas";

interface DashboardContentPageProps {
  stats: DashBoardStats[];
  recentActivity: DashboardRecentActivity[];
  assetsByStatus: DashboardAssetsByStatus[];
  pendingApprovals: DashboardPendingApprovals[];
  onAction: (year: number) => void;
}

import {
  Package,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  package: Package,
  activity: Activity,
  clock: Clock,
  alertTriangle: AlertTriangle,
} as const;


export default function DashboardContentSection({ 
  stats,
  recentActivity,
  assetsByStatus,
  pendingApprovals,
  onAction,
}: DashboardContentPageProps) {
  return (
    <div className="">
       {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => {
          const Icon = iconMap[s.icon as keyof typeof iconMap];
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.change}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

        
      {/* Asset Status Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Asset Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assetsByStatus.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-medium text-gray-800">{s.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full`}
                      style={{ width: `${(s.count / s.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Activity</CardTitle>
            <span className="text-xs text-gray-400">Today</span>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  a.type === 'success' ? 'bg-green-500' : a.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800">{a.action}</div>
                  <div className="text-xs text-gray-400 truncate">{a.detail}</div>
                </div>
                <div className="text-[10px] text-gray-400 flex-shrink-0">{a.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Approvals</CardTitle>
          <Badge variant="warning">{pendingApprovals.length} pending</Badge>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Reference', 'Type', 'Department', 'Amount', 'Current Step', ''].map(h => (
                  <th key={h} className="px-5 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-blue-600">{p.id}</td>
                  <td className="px-5 py-3 text-xs text-gray-700">{p.type}</td>
                  <td className="px-5 py-3 text-xs text-gray-600">{p.dept}</td>
                  <td className="px-5 py-3 text-xs font-medium text-gray-800">{p.amount}</td>
                  <td className="px-5 py-3">
                    <Badge variant={p.urgent ? 'warning' : 'secondary'}>{p.step}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Button variant="ghost" size="sm" className="text-xs h-7">Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}