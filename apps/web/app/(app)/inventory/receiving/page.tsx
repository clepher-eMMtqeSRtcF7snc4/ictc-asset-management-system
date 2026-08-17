import { ReceivingTable } from "@/components/inventory/inventory-pages"
import { receivingRecords } from "@/components/inventory/types"

export default function Page() {
  return <ReceivingTable data={receivingRecords} showColumns />
}
