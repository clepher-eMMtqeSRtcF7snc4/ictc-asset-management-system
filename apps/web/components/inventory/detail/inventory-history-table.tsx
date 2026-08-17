"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { receivingRecords, issuanceRecords, adjustmentRecords, stockCountRecords } from "../types"

type HistoryRow = {
  id: string
  date: string
  referenceNo: string
  transaction: string
  quantity: number
  user: string
  status: string
}

export function InventoryHistoryTable({ itemId }: { itemId: string }) {
  // TODO: Replace with tRPC query filtered by itemId.
  const rows: HistoryRow[] = []

  return (
    <div className="rounded-lg border">
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold">Inventory History</h2>
        <p className="text-xs text-muted-foreground">Recent transactions for this item</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-xs">Date</TableHead>
              <TableHead className="whitespace-nowrap text-xs">Reference No.</TableHead>
              <TableHead className="whitespace-nowrap text-xs">Transaction</TableHead>
              <TableHead className="whitespace-nowrap text-xs">Quantity</TableHead>
              <TableHead className="whitespace-nowrap text-xs">User</TableHead>
              <TableHead className="whitespace-nowrap text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                  No history found for this item.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs">{row.date}</TableCell>
                  <TableCell className="font-mono text-xs">{row.referenceNo}</TableCell>
                  <TableCell className="text-xs">{row.transaction}</TableCell>
                  <TableCell className="text-xs tabular-nums">{row.quantity}</TableCell>
                  <TableCell className="text-xs">{row.user}</TableCell>
                  <TableCell className="text-xs capitalize">{row.status.toLowerCase().replace("_", " ")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
