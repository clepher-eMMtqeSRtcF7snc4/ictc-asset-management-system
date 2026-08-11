import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FilePlus2 } from "lucide-react"

export function RequestsPage() { return <div className="space-y-6"><PageHeader title="Requests" description="Review asset, inventory, and service requests awaiting action." action={<Button><FilePlus2 /> Create request</Button>} /><Card><CardHeader><CardTitle>Request queue</CardTitle></CardHeader><CardContent className="space-y-3">{[["AR-2026-0012", "Asset request", "College of Computing", "Pending"], ["IR-2026-0034", "Inventory request", "Registrar", "Approved"], ["MR-2026-0047", "Maintenance request", "Engineering", "In Progress"]].map(([id, type, department, status]) => <div key={id} className="flex items-center justify-between rounded-md border p-3"><div><p className="font-mono text-xs text-primary">{id}</p><p className="font-medium">{type}</p><p className="text-xs text-muted-foreground">{department}</p></div><Badge variant={status === "Approved" ? "success" : status === "Pending" ? "warning" : "info"}>{status}</Badge></div>)}</CardContent></Card></div> }
