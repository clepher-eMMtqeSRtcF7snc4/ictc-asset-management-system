import { Badge } from "@/components/ui/badge"
import type { AssetCondition } from "./types"

const variants: Record<AssetCondition, "success" | "info" | "warning" | "destructive"> = {
  EXCELLENT: "success",
  GOOD: "success",
  FAIR: "warning",
  POOR: "destructive",
}

export function AssetConditionBadge({ condition }: { condition: AssetCondition }) {
  return <Badge variant={variants[condition]}>{condition}</Badge>
}
