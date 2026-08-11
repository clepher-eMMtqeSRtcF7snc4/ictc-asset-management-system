import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Boxes, ClipboardCheck, PackageCheck, Truck } from "lucide-react"

export function ReceivingPage() {
  return <div className="space-y-6"><PageHeader title="Receiving & Inspection" description="Receive deliveries, inspect acceptance, and classify items as assets or inventory." action={<Button><Truck /> Receive delivery</Button>} /><Card><CardHeader><CardTitle>Delivery DR-2026-0018</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-4">{[["Ordered", "50"], ["Received", "50"], ["Accepted", "48"], ["Rejected", "2"]].map(([label, value]) => <div key={label} className="rounded-md border p-4"><p className="text-xs text-muted-foreground">{label} quantity</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}</CardContent></Card><div className="grid gap-5 md:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><PackageCheck /> Asset classification</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Create individual asset records and capture serial number, property number, and asset tag.</p><Button className="mt-4" variant="outline">Create asset records</Button></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Boxes /> Inventory classification</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Update item quantities, storage location, and unit cost after acceptance.</p><Button className="mt-4" variant="outline">Update inventory stock</Button></CardContent></Card></div></div>
}
