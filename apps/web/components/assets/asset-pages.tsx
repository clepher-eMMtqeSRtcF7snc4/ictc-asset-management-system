import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ClipboardSignature, Laptop, MapPin, PackagePlus, RotateCcw, SendHorizontal } from "lucide-react"
import Link from "next/link"

const assets: [string, string, string, string, string][] = [
  ["AST-2026-000145", "Dell Latitude 5450", "Laptop", "John Dela Cruz", "In Use"],
  ["AST-2026-000144", "Dell P2422H Monitor", "Peripheral", "ICT Stockroom", "Available"],
  ["AST-2026-000143", "APC UPS 650VA", "Power Equipment", "Engineering Lab", "Under Maintenance"],
]

const statusVariant = (status: string) => status === "Available" ? "success" : status === "In Use" ? "info" : "warning"

export function AssetListPage() {
  return <div className="space-y-6">
    <PageHeader title="Assets" description="Track individually identified ICT equipment, custodians, locations, and lifecycle status." action={<Button asChild><Link href="/assets/registration"><PackagePlus /> Add asset</Link></Button>} />
    <div className="grid gap-3 md:grid-cols-3">
      {[["2,345", "Total assets"], ["256", "Available for assignment"], ["₱48.6M", "Acquisition value"]].map(([value, label]) => <Card key={label}><CardContent className="p-4"><p className="text-2xl font-semibold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>)}
    </div>
    <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Asset registry</CardTitle><Button size="sm" variant="outline">Filter assets</Button></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b text-left text-xs text-muted-foreground"><tr>{["Asset tag", "Asset", "Category", "Assigned to / Location", "Status", ""].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{assets.map(([tag, name, category, holder, status]) => <tr key={tag} className="border-b"><td className="p-3 font-mono text-xs text-primary">{tag}</td><td className="p-3 font-medium">{name}</td><td className="p-3">{category}</td><td className="p-3">{holder}</td><td className="p-3"><Badge variant={statusVariant(status)}>{status}</Badge></td><td className="p-3"><Button asChild size="xs" variant="ghost"><Link href={`/assets/${tag}`}><ArrowRight /> View</Link></Button></td></tr>)}</tbody></table></div></CardContent></Card>
  </div>
}

export function AssetDetailPage({ assetId }: { assetId: string }) {
  return <div className="space-y-6">
    <PageHeader title="Dell Latitude 5450" description={`Asset profile · ${assetId}`} action={<div className="flex gap-2"><Button variant="outline"><SendHorizontal /> Transfer</Button><Button><ClipboardSignature /> Assign</Button></div>} />
    <Card><CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto]"><div className="space-y-3"><Badge variant="info">In Use</Badge><div className="grid gap-3 sm:grid-cols-3">{[["Property number", "MSU-ICT-2026-00145"], ["Serial number", "DL5450-PH-87422"], ["Current value", "₱41,225"]].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium">{value}</p></div>)}</div></div><div className="flex size-28 items-center justify-center rounded-md border font-mono text-xs">QR CODE</div></CardContent></Card>
    <div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Current assignment</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p className="font-medium">John Dela Cruz</p><p className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" /> ICT Center · Room 204</p><p className="text-muted-foreground">Accountability acknowledged on Jul 05, 2026</p></CardContent></Card><Card><CardHeader><CardTitle>Lifecycle history</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p><strong>Assigned</strong><br /><span className="text-muted-foreground">Jul 05, 2026 · John Dela Cruz</span></p><p><strong>Registered</strong><br /><span className="text-muted-foreground">Jul 05, 2026 · Receiving DR-2026-0018</span></p></CardContent></Card></div>
  </div>
}

export function AssetAssignmentPage() {
  return <div className="space-y-6"><PageHeader title="Asset Assignment" description="Assign an available asset and establish employee accountability." /><Card><CardContent className="p-6"><div className="flex flex-col gap-3 lg:flex-row lg:items-center">{["Select available asset", "Select employee", "Set department & location", "Confirm accountability"].map((step, index) => <div key={step} className="flex flex-1 items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span><span className="text-sm font-medium">{step}</span>{index < 3 && <ArrowRight className="ml-auto hidden size-4 text-muted-foreground lg:block" />}</div>)}</div><div className="mt-6 rounded-md border bg-muted/30 p-4 text-sm"><strong>Dell P2422H Monitor</strong> is available. The selected employee becomes responsible for this asset after confirmation.</div><div className="mt-4 flex justify-end"><Button><ClipboardSignature /> Generate accountability document</Button></div></CardContent></Card></div>
}

export function AssetTransferPage() {
  return <div className="space-y-6"><PageHeader title="Asset Transfer" description="Move custody or location while retaining the complete asset history." /><Card><CardHeader><CardTitle>Transfer request TR-2026-0032</CardTitle></CardHeader><CardContent className="grid gap-5 md:grid-cols-2"><div><p className="text-xs text-muted-foreground">Current custodian</p><p className="font-medium">ICT Center · John Dela Cruz</p></div><div><p className="text-xs text-muted-foreground">Proposed custodian</p><p className="font-medium">Registrar · Maria Santos</p></div><div className="md:col-span-2 flex justify-between rounded-md bg-muted/50 p-3 text-sm"><span>Awaiting Department Head approval</span><Badge variant="warning">Pending</Badge></div></CardContent></Card></div>
}

export function AssetReturnPage() {
  return <div className="space-y-6"><PageHeader title="Asset Returns" description="Record condition checks and return assets to stock or maintenance." /><Card><CardContent className="p-6"><div className="grid gap-4 md:grid-cols-3">{[["1", "Locate assigned asset"], ["2", "Inspect condition"], ["3", "Return to stock or maintenance"]].map(([number, step]) => <div key={number} className="rounded-md border p-4"><span className="text-primary font-semibold">{number}</span><p className="mt-2 font-medium">{step}</p></div>)}</div><div className="mt-5 flex justify-end"><Button variant="outline"><RotateCcw /> Start return inspection</Button></div></CardContent></Card></div>
}
