import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Wrench } from "lucide-react"

export function MaintenancePage() {
  return <div className="space-y-6"><PageHeader title="Maintenance" description="Manage tickets from request and diagnosis through repair, testing, and return." action={<Button><Wrench /> New maintenance request</Button>} /><div className="grid gap-3 md:grid-cols-4">{[["17", "Open"], ["14", "In progress"], ["3", "Overdue"], ["₱247,500", "Maintenance cost"]].map(([value, label]) => <Card key={label}><CardContent className="p-4"><p className="text-2xl font-semibold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>)}</div><Card><CardHeader><CardTitle>Active work orders</CardTitle></CardHeader><CardContent><div className="rounded-md border p-4"><div className="flex items-center justify-between"><div><p className="font-mono text-xs text-primary">MR-2026-0047</p><p className="mt-1 font-medium">Epson L3250 paper-feed issue</p><p className="text-sm text-muted-foreground">Assigned to Rico Villanueva · Priority: High</p></div><Badge variant="warning">In Progress</Badge></div></div></CardContent></Card></div>
}

export function MaintenanceDetailPage({ ticketId }: { ticketId: string }) {
  return <div className="space-y-6"><PageHeader title={`Work Order ${ticketId}`} description="Diagnose, repair, test, and safely return the affected asset." action={<Button><ClipboardList /> Update work order</Button>} /><Card><CardContent className="p-6"><ol className="grid gap-3 md:grid-cols-6">{["Request", "Inspection", "Diagnosis", "Repair", "Testing", "Completed"].map((step, index) => <li key={step} className={`rounded-md border p-3 text-sm ${index === 3 ? "border-primary bg-primary/5" : ""}`}><p className="text-xs text-muted-foreground">Step {index + 1}</p><p className="mt-1 font-medium">{step}</p></li>)}</ol></CardContent></Card><Card><CardHeader><CardTitle>Technician notes</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Paper-feed rollers require replacement. Testing is scheduled after parts are installed.</p></CardContent></Card></div>
}
