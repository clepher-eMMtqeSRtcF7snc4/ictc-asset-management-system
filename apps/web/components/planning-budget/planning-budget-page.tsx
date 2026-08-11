import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet } from "lucide-react"

export function PlanningBudgetPage() { return <div className="space-y-6"><PageHeader title="Planning & Budget" description="Prepare ICT asset and inventory requirements before procurement." action={<Button><FileSpreadsheet /> Create plan</Button>} /><div className="grid gap-5 md:grid-cols-2"><Card><CardHeader><CardTitle>FY 2026 ICT plan</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">₱8,450,000</p><p className="text-sm text-muted-foreground">Proposed asset and inventory requirements</p></CardContent></Card><Card><CardHeader><CardTitle>Budget utilization</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">64%</p><p className="text-sm text-muted-foreground">Committed through approved purchase requests</p></CardContent></Card></div></div> }
