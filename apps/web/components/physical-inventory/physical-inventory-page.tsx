import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, ScanLine, TriangleAlert } from "lucide-react"

export function PhysicalInventoryPage() {
  return <div className="space-y-6"><PageHeader title="Physical Inventory" description="Scan assets, compare system records, and resolve verification discrepancies." action={<Button><ScanLine /> Start verification</Button>} /><div className="grid gap-3 md:grid-cols-5">{[["2,345", "Expected"], ["2,270", "Verified"], ["31", "Missing"], ["18", "Moved"], ["26", "Damaged"]].map(([value, label]) => <Card key={label}><CardContent className="p-4"><p className="text-xl font-semibold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>)}</div><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Scan asset tag</CardTitle></CardHeader><CardContent className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed"><QrCode className="size-10 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Ready for QR or barcode scan</p><p className="text-xs text-muted-foreground">Selected location: ICT Center</p></CardContent></Card><Card><CardHeader><CardTitle>Discrepancies requiring action</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex justify-between rounded-md border p-3"><div><p className="font-medium">AST-2024-000082</p><p className="text-xs text-muted-foreground">Wrong location</p></div><Badge variant="warning"><TriangleAlert /> Investigate</Badge></div></CardContent></Card></div></div>
}
