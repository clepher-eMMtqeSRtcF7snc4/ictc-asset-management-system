import { IssuanceTable } from "@/components/inventory/inventory-pages"
import { issuanceRecords } from "@/components/inventory/types"

export default function Page() {
  return <IssuanceTable data={issuanceRecords} showColumns />
}
