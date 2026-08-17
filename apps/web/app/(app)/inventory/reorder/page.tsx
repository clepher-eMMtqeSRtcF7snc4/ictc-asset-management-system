import { ReorderTable } from "@/components/inventory/inventory-pages"
import { reorderItems } from "@/components/inventory/types"

export default function Page() {
  return <ReorderTable data={reorderItems} showColumns />
}
