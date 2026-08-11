"use client"

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetCategory, AssetType, Department, FundSource } from "@repo/trpc/schemas";
import { Button } from "../ui/button";
import { useState } from "react";
import { CheckCircle2, Printer, QrCode, Upload } from "lucide-react";

interface AssRegContentPageProps {
  category: AssetCategory[];
  type: AssetType[];
  departments: Department[];
  fundSource: FundSource[];
  onAction: (year: number) => void;
}


export default function RegisterAsset({
  category,
  type,
  departments,
  fundSource
}:AssRegContentPageProps) {
  const [saved, setSaved] = useState(false);

  return <div>
    <div className="grid grid-cols-3 gap-4">
      <form
        id="asset-registration-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
            <div className="col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-muted-foreground">Asset ID (Auto-generated)</Label>
                      <Input
                        className="mt-1 font-mono bg-gray-50"
                        value="AST-2026-000146"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label>Asset Name</Label>
                      <Input
                        className="mt-1"
                        defaultValue="Dell OptiPlex 7090"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Select>
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categoty</SelectLabel>
                            {category.map((item) => item.value !== null && (
                              <SelectItem key={item.id} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Asset type</SelectLabel>
                            {type.map((item) => item.value !== null && (
                              <SelectItem key={item.id} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Brand</Label>
                      <Input className="mt-1" defaultValue="Dell" />
                    </div>
                    <div>
                      <Label>Model</Label>
                      <Input className="mt-1" defaultValue="OptiPlex 7090" />
                    </div>
                    <div>
                      <Label>Serial Number</Label>
                      <Input
                        className="mt-1 font-mono"
                        defaultValue="CN-0JKD-XY789"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acquisition & Vendor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Purchase Cost (₱)</Label>
                      <Input className="mt-1 font-mono" defaultValue="48,500" />
                    </div>
                    <div>
                      <Label>Acquisition Date</Label>
                      <Input
                        className="mt-1"
                        type="date"
                        defaultValue="2026-07-05"
                      />
                    </div>
                    <div>
                      <Select>
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Funding source</SelectLabel>
                            {fundSource.map((item) => item.value !== null && (
                              <SelectItem key={item.id} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>PO Number</Label>
                      <Input
                        className="mt-1 font-mono"
                        defaultValue="PO-2026-0015"
                      />
                    </div>
                    <div>
                      <Label>Invoice Number</Label>
                      <Input
                        className="mt-1 font-mono"
                        defaultValue="INV-10234"
                      />
                    </div>
                    <div>
                      <Label>Vendor</Label>
                      <Input className="mt-1" defaultValue="Dell Philippines" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location & Custodian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Select>
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Department</SelectLabel>
                            {departments.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {/* <Label>Department</Label>
                      <Select className="mt-1">
                        <option>College of Information Technology</option>
                        <option>College of Engineering</option>
                        <option>Registrar</option>
                      </Select> */}
                    </div>
                    <div>
                      <Label>Building</Label>
                      <Input className="mt-1" defaultValue="IT Building" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Floor</Label>
                      <Input className="mt-1" defaultValue="2nd Floor" />
                    </div>
                    <div>
                      <Label>Room</Label>
                      <Input
                        className="mt-1"
                        defaultValue="Computer Laboratory 3"
                      />
                    </div>
                    <div>
                      <Label>Custodian</Label>
                      <Input className="mt-1" defaultValue="Juan Dela Cruz" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Warranty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Warranty Start</Label>
                      <Input
                        className="mt-1"
                        type="date"
                        defaultValue="2026-07-05"
                      />
                    </div>
                    <div>
                      <Label>Warranty End</Label>
                      <Input
                        className="mt-1"
                        type="date"
                        defaultValue="2029-07-05"
                      />
                    </div>
                    <div>
                      <Label>Period (Auto-computed)</Label>
                      <Input
                        className="mt-1 bg-gray-50"
                        value="3 Years"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {saved ? "✓ Asset Saved — AST-2026-000146" : "Save Asset"}
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-1" /> Upload Documents
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-1" /> Print Label
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Generated IDs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Asset ID", value: "AST-2026-000146" },
                    { label: "Property Number", value: "MSU-ICT-2026-00146" },
                    { label: "Barcode", value: "BAR-00000146" },
                  ].map((f) => (
                    <div key={f.label}>
                      <div className="text-xs text-gray-500 mb-1">
                        {f.label}
                      </div>
                      <div className="font-mono text-sm bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5">
                        {f.value}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <QrCode className="w-8 h-8 text-gray-300 mx-auto" />
                      <div className="text-xs text-gray-400 mt-1">
                        QR Code Preview
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  {[
                    "Required fields complete",
                    "Serial number unique",
                    "Property number unique",
                    "Valid acquisition date",
                    "Department assigned",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 mb-2 text-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span className="text-gray-700">{c}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {saved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-medium text-green-800 text-sm">
                    Asset Registered!
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Audit trail created · QR generated
                  </div>
                </div>
              )}
            </div>
      </form>
    </div>
  </div>
}