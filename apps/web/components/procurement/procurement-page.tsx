import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, FilePlus2, ShoppingCart } from "lucide-react"

export function ProcurementPage() {
  return <div className="space-y-6"><PageHeader title="Procurement" description="Manage purchase requests, approval progression, and purchase order readiness." action={<Button><FilePlus2 /> New purchase request</Button>} /><div className="grid gap-3 md:grid-cols-3">{[["8", "Draft requests"], ["12", "Under review"], ["6", "Purchase orders open"]].map(([value, label]) => <Card key={label}><CardContent className="p-4"><p className="text-2xl font-semibold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>)}</div><Card><CardHeader><CardTitle>Purchase request workflow</CardTitle></CardHeader><CardContent><ol className="grid gap-3 md:grid-cols-5">{["Draft", "Submitted", "Under Review", "Approved", "Ordered"].map((step, index) => <li key={step} className="rounded-md border p-3 text-sm"><span className="text-primary">{index + 1}.</span><p className="mt-1 font-medium">{step}</p></li>)}</ol><div className="mt-5 rounded-md border p-4"><div className="flex items-center justify-between"><div><p className="font-mono text-xs text-primary">PR-2026-0001</p><p className="mt-1 font-medium">Network laboratory equipment</p><p className="text-sm text-muted-foreground">College of Engineering · ₱1,195,000</p></div><Badge variant="warning">Budget Office</Badge></div></div></CardContent></Card></div>
}
