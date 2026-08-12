import { Badge } from "@/components/ui/badge"
import type { AssetStatus } from "./types"

const variants: Record<AssetStatus, "success" | "info" | "warning" | "outline" | "destructive"> = {
  AVAILABLE: "info",
  ASSIGNED: "success",
  UNDER_MAINTENANCE: "warning",
  FOR_TRANSFER: "warning",
  FOR_DISPOSAL: "warning",
  DISPOSED: "outline",
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return <Badge variant={variants[status]}>{status.replaceAll("_", " ")}</Badge>
}
