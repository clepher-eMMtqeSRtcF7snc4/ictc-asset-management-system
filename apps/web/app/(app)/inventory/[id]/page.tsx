import { InventoryItemDetail } from "@/components/inventory/detail/inventory-item-detail"

export default function InventoryItemDetailPage({ params }: { params: { id: string } }) {
  return <InventoryItemDetail itemId={params.id} />
}