"use client"

import { formatCurrency } from "../types"
import type { ReceivingRecord, IssuanceRecord, AdjustmentRecord, StockCountRecord } from "../types"

export type RecentActivityItem = {
  id: string
  date: string
  referenceNo: string
  item: string
  transaction: string
  quantity: number
  user: string
  status: string
}

export function buildRecentActivity(
  receivingRecords: ReceivingRecord[],
  issuanceRecords: IssuanceRecord[],
  adjustmentRecords: AdjustmentRecord[],
  stockCountRecords: StockCountRecord[],
): RecentActivityItem[] {
  const activities: RecentActivityItem[] = []

  receivingRecords.forEach((r) => {
    activities.push({
      id: `recv-${r.id}`,
      date: r.receivedDate,
      referenceNo: r.referenceNo,
      item: `${r.totalItems} item(s)`,
      transaction: "Received",
      quantity: r.totalItems,
      user: r.receivedBy,
      status: r.status,
    })
  })

  issuanceRecords.forEach((r) => {
    activities.push({
      id: `iss-${r.id}`,
      date: r.issuedDate,
      referenceNo: r.referenceNo,
      item: `${r.totalItems} item(s)`,
      transaction: "Issued",
      quantity: r.totalItems,
      user: r.issuedBy,
      status: r.status,
    })
  })

  adjustmentRecords.forEach((r) => {
    activities.push({
      id: `adj-${r.id}`,
      date: r.adjustmentDate,
      referenceNo: r.referenceNo,
      item: `${r.totalItems} item(s)`,
      transaction: r.type === "INCREASE" ? "Adjusted" : "Adjusted",
      quantity: r.totalItems,
      user: r.adjustedBy,
      status: r.status,
    })
  })

  stockCountRecords.forEach((r) => {
    activities.push({
      id: `sc-${r.id}`,
      date: r.countDate,
      referenceNo: r.referenceNo,
      item: `${r.totalItems} item(s)`,
      transaction: "Counted",
      quantity: r.variances,
      user: r.countedBy,
      status: r.status,
    })
  })

  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
}

const transactionColors: Record<string, string> = {
  Received: "text-emerald-600 bg-emerald-50",
  Issued: "text-blue-600 bg-blue-50",
  Adjusted: "text-amber-600 bg-amber-50",
  Counted: "text-purple-600 bg-purple-50",
}

export function RecentInventoryActivity({ activities }: { activities: RecentActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-lg border">
        <div className="border-b px-5 py-4">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
          <p className="text-xs text-muted-foreground">Latest inventory transactions</p>
        </div>
        <div className="p-8 text-center text-sm text-muted-foreground">No recent activity found.</div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold">Recent Activity</h2>
        <p className="text-xs text-muted-foreground">Latest inventory transactions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Reference No.</th>
              <th className="p-3">Transaction</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b">
                <td className="p-3 whitespace-nowrap text-xs">{activity.date}</td>
                <td className="p-3 font-mono text-xs">{activity.referenceNo}</td>
                <td className="p-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${transactionColors[activity.transaction] ?? "bg-muted text-muted-foreground"}`}>
                    {activity.transaction}
                  </span>
                </td>
                <td className="p-3 tabular-nums">{activity.quantity}</td>
                <td className="p-3 text-xs">{activity.user}</td>
                <td className="p-3">
                  <span className="text-xs capitalize">{activity.status.toLowerCase().replace("_", " ")}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
