"use client"

import { useMemo, useState } from "react"
import { AssetListHeaderSection } from "./asset-list-header-section"
import { AssetListTable } from "./asset-list-table"
import { AssetListToolbar, type AssetFilters } from "./asset-list-toolbar"
import { AssetSummaryCards } from "./asset-summary-cards"
import { assetListItems, type AssetStatus } from "./types"

const initialFilters: AssetFilters = { search: "", category: "ALL", status: "ALL", department: "ALL", condition: "ALL" }

export function AssetListContentSection() {
  const [filters, setFilters] = useState(initialFilters)
  const [showColumns, setShowColumns] = useState(false)
  const data = useMemo(() => assetListItems.filter((asset) => {
    const query = filters.search.trim().toLowerCase()
    const matchesSearch = !query || [asset.assetTag, asset.propertyNumber, asset.name, asset.serialNumber, asset.brandModel, asset.custodian].join(" ").toLowerCase().includes(query)
    return matchesSearch && (filters.category === "ALL" || asset.category === filters.category) && (filters.status === "ALL" || asset.status === filters.status) && (filters.department === "ALL" || asset.department === filters.department) && (filters.condition === "ALL" || asset.condition === filters.condition)
  }), [filters])
  const filterStatus = (status?: AssetStatus) => setFilters({ ...initialFilters, status: status ?? "ALL" })
  return <main className="mx-auto max-w-[1440px] space-y-5"><AssetListHeaderSection /><AssetSummaryCards onFilter={filterStatus} /><AssetListToolbar filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} onColumns={() => setShowColumns((value) => !value)} /><AssetListTable data={data} showColumns={showColumns} /></main>
}
