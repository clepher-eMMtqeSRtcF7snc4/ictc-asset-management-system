import type { AssignableAsset } from "./types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop } from "lucide-react";

export function AssetPreviewCard({ asset }: { asset?: AssignableAsset }) {
  return <Card><CardContent className="p-4"><p className="mb-3 text-xs font-semibold">Asset Preview</p>{asset ? <div className="space-y-3"><div className="flex gap-3"><div className="grid size-14 place-items-center rounded bg-muted"><Laptop className="size-7 text-muted-foreground" /></div><div><p className="font-semibold">{asset.name}</p><p className="font-mono text-xs text-primary">{asset.assetTag}</p><Badge variant="success" className="mt-1">Available</Badge></div></div><dl className="grid grid-cols-2 gap-2 text-xs">{[["Property No.", asset.propertyNumber], ["Serial Number", asset.serialNumber], ["Category", asset.category], ["Brand / Model", asset.brandModel], ["Location", asset.location], ["Condition", asset.condition]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl></div> : <p className="text-sm text-muted-foreground">Select an available asset to preview its assignment details.</p>}</CardContent></Card>;
}
