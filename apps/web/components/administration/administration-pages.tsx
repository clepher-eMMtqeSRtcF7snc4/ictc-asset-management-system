import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ShieldCheck } from "lucide-react"

const content = {
  users: { title: "Users", description: "Manage staff access, department assignment, and account status.", rows: [["Maria Santos", "ICT Inventory Officer", "College of Computing", "Active"], ["Rico Villanueva", "ICT Technician", "ICT Center", "Active"]] },
  roles: { title: "Roles & Permissions", description: "Define least-privilege access for each ICT system role.", rows: [["Super Administrator", "Full system access", "12 permissions", "Active"], ["ICT Technician", "Maintenance and asset history", "6 permissions", "Active"]] },
  categories: { title: "Categories", description: "Maintain asset and inventory categories for accurate reporting.", rows: [["Computers", "Asset", "912 records", "Active"], ["Cables & Adapters", "Inventory", "84 items", "Active"]] },
  locations: { title: "Locations", description: "Configure departments, buildings, rooms, and storage areas.", rows: [["ICT Center", "Building", "12 rooms", "Active"], ["College of Computing", "Department", "18 rooms", "Active"]] },
  suppliers: { title: "Suppliers", description: "Maintain supplier details for procurement and receiving.", rows: [["TechSource Philippines", "ICT Equipment", "12 deliveries", "Active"], ["Dell Philippines", "Computers", "8 deliveries", "Active"]] },
  audit: { title: "Audit Logs", description: "Review immutable system actions and record changes.", rows: [["John Dela Cruz", "Updated asset", "AST-2026-000145", "2 min ago"], ["Maria Santos", "Approved request", "PR-2026-0001", "18 min ago"]] },
}

type AdministrationView = keyof typeof content

export function AdministrationPage({ view }: { view: AdministrationView }) {
  const page = content[view]
  return <div className="space-y-6"><PageHeader title={page.title} description={page.description} action={view === "audit" ? undefined : <Button><Plus /> Add {page.title.slice(0, -1)}</Button>} /><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{page.title} directory</CardTitle>{view === "roles" && <Button size="sm" variant="outline"><ShieldCheck /> Permission matrix</Button>}</CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><tbody>{page.rows.map((row) => <tr key={row[0]} className="border-b"><td className="p-3 font-medium">{row[0]}</td><td className="p-3 text-muted-foreground">{row[1]}</td><td className="p-3 text-muted-foreground">{row[2]}</td><td className="p-3"><Badge variant={row[3] === "Active" ? "success" : "secondary"}>{row[3]}</Badge></td></tr>)}</tbody></table></div></CardContent></Card></div>
}
