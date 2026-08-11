import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArchiveRestore, FilePlus2 } from "lucide-react"

export function DisposalPage() { return <div className="space-y-6"><PageHeader title="Asset Disposal" description="Manage disposal requests without deleting historical asset records." action={<Button><FilePlus2 /> New disposal request</Button>} /><Card><CardHeader><CardTitle>Controlled disposal workflow</CardTitle></CardHeader><CardContent><ol className="grid gap-3 md:grid-cols-6">{["Select asset", "Request", "Inspect", "Approve", "Dispose", "Complete"].map((step, index) => <li key={step} className="rounded-md border p-3 text-sm"><span className="text-primary">{index + 1}.</span><p className="mt-1 font-medium">{step}</p></li>)}</ol></CardContent></Card><Card><CardContent className="flex items-center justify-between p-4"><div><p className="font-medium">DR-2026-0008 · HP ProDesk 490</p><p className="text-sm text-muted-foreground">Reason: Beyond Repair · Book value: ₱0</p></div><Badge variant="warning">For Approval</Badge></CardContent></Card></div> }
