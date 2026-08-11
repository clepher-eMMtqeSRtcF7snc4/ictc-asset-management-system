"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetCategory, Assets, AssetsStats, AssetType, Department, FundSource } from "@repo/trpc/schemas";

interface AssRegContentPageProps {
  stats: AssetsStats[];
  assets: Assets[];
  category: AssetCategory[];
  type: AssetType[];
  departments: Department[];
  fundSource: FundSource[];
  onAction: (year: number) => void;
}

import { Package, Activity, Clock, AlertTriangle, Upload, Printer, QrCode, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useState } from "react";
import RegisterAsset from "./register-asset";

const iconMap = {
  package: Package,
  activity: Activity,
  clock: Clock,
  alertTriangle: AlertTriangle,
} as const;

export default function AssRegContentSection({
  stats,
  assets,
  category,
  type,
  departments,
  fundSource,
  onAction,
}: AssRegContentPageProps) {
  

  const statusBadge = (s: string) => {
  const map: Record<string, 'success' | 'info' | 'secondary'> = { 'In Stock': 'success', Assigned: 'info', Maintenance: 'secondary' }
  return <Badge variant={map[s] || 'secondary'}>{s}</Badge>
}

  return (
    <div className="">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = iconMap[s.icon as keyof typeof iconMap];
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {s.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{s.change}</p>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="register">
        <TabsList className="mb-4">
          <TabsTrigger value="register">Register Asset</TabsTrigger>
          <TabsTrigger value="list">Asset Registry</TabsTrigger>
          <TabsTrigger value="label">Asset Label</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <RegisterAsset
            category={category}
            type={type}
            departments={departments}
            fundSource={fundSource}
            onAction={onAction}
          />
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Registered Assets</CardTitle>
              <Badge variant="secondary">2,345 total</Badge>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      "Asset ID",
                      "Name",
                      "Category",
                      "Department",
                      "Status",
                      "Date Registered",
                      "",
                    ].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-blue-600 text-xs">
                        {a.id}
                      </TableCell>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-gray-500">
                        {a.category}
                      </TableCell>
                      <TableCell className="text-gray-500">{a.dept}</TableCell>
                      <TableCell>{statusBadge(a.status)}</TableCell>
                      <TableCell className="text-gray-400 text-xs">
                        {a.date}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="label">
          <div className="flex justify-center">
            <Card className="w-72">
              <CardContent className="p-6 text-center">
                <div className="border-2 border-gray-800 rounded-lg p-4">
                  <div className="text-xs font-bold text-gray-600 mb-1 uppercase tracking-widest">
                    Mindanao State University
                  </div>
                  <div className="border-t border-gray-300 my-2" />
                  <div className="text-[10px] text-gray-500 mb-0.5">
                    Asset ID
                  </div>
                  <div className="font-mono font-bold text-base">
                    AST-2026-000146
                  </div>
                  <div className="my-3 flex items-center justify-center">
                    <div className="w-28 h-28 border border-gray-200 rounded flex items-center justify-center bg-gray-50">
                      <QrCode className="w-20 h-20 text-gray-700" />
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 mb-0.5">
                    Property Number
                  </div>
                  <div className="font-mono text-xs font-semibold">
                    MSU-ICT-2026-00146
                  </div>
                  <div className="border-t border-gray-300 my-2" />
                  <div className="text-[10px] text-gray-500">
                    Dell OptiPlex 7090
                  </div>
                  <div className="text-[10px] text-gray-400">
                    College of Information Technology
                  </div>
                </div>
                <Button size="sm" className="mt-4 w-full">
                  <Printer className="w-3.5 h-3.5 mr-1" /> Print Label
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
