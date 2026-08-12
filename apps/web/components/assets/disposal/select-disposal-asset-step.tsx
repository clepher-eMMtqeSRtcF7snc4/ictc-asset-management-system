"use client"

import { Filter, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { disposalAssets, type DisposalAsset } from "./types"

export function SelectDisposalAssetStep({
  selected,
  onSelect,
}: {
  selected?: DisposalAsset
  onSelect: (asset: DisposalAsset) => void
}) {
  const [search, setSearch] = useState("")
  const assets = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return disposalAssets
    return disposalAssets.filter((asset) =>
      [asset.assetTag, asset.propertyNumber, asset.name, asset.serialNumber, asset.category]
        .join(" ")
        .toLowerCase()
        .includes(query),
    )
  }, [search])

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">1. Select Asset</h2>
        <p className="text-xs text-muted-foreground">Search and select an asset eligible for disposal.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search by asset tag, property number, serial number, or name..." />
        </div>
        <Button variant="outline"><Filter /> Filters</Button>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {["", "Asset Tag", "Property No.", "Asset Name", "Category", "Serial Number", "Condition", "Status", "Actions"].map((label, index) => (
                <TableHead key={`${label}-${index}`} className="whitespace-nowrap text-[11px]">{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} data-state={asset.id === selected?.id ? "selected" : undefined}>
                <TableCell><input aria-label={`Select ${asset.name}`} type="radio" name="disposal-asset" checked={asset.id === selected?.id} onChange={() => onSelect(asset)} /></TableCell>
                <TableCell className="font-mono text-xs text-primary">{asset.assetTag}</TableCell>
                <TableCell className="font-mono text-xs">{asset.propertyNumber}</TableCell>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell className="font-mono text-xs">{asset.serialNumber}</TableCell>
                <TableCell>{asset.condition}</TableCell>
                <TableCell><Badge variant="warning">{asset.status}</Badge></TableCell>
                <TableCell><Button size="xs" variant="outline" onClick={() => onSelect(asset)}>View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selected && <SelectedAsset asset={selected} />}
    </section>
  )
}

function SelectedAsset({ asset }: { asset: DisposalAsset }) {
  return (
    <div className="rounded-md border border-info-border bg-info p-4 text-info-foreground">
      <p className="mb-3 text-xs font-semibold">Selected Asset</p>
      <div className="grid gap-3 text-xs sm:grid-cols-3 lg:grid-cols-5">
        <p><strong>{asset.name}</strong><br /><span className="font-mono">{asset.assetTag}</span></p>
        <p><span className="opacity-70">Current Location</span><br />{asset.location}</p>
        <p><span className="opacity-70">Acquired Date</span><br />{asset.acquiredDate}</p>
        <p><span className="opacity-70">Acquisition Cost</span><br />{asset.acquisitionCost}</p>
        <p><span className="opacity-70">Book Value</span><br />{asset.bookValue}</p>
      </div>
    </div>
  )
}
