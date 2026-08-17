import { StockCountTable } from "@/components/inventory/inventory-pages"
import { stockCountRecords } from "@/components/inventory/types"

export default function Page() {
  return <StockCountTable data={stockCountRecords} showColumns />
}
