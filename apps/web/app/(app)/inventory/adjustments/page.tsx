import { AdjustmentsTable } from "@/components/inventory/inventory-pages"
import { adjustmentRecords } from "@/components/inventory/types"

export default function Page() {
  return <AdjustmentsTable data={adjustmentRecords} showColumns />
}
