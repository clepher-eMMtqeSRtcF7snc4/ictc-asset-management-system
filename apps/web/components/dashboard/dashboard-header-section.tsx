import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { CalendarDays, Download, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardHeaderSection() {
  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Asset & Inventory Dashboard"
          description="Overview of ICT assets, inventory, assignments, maintenance, and stock."
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarDays />
            FY 2026
          </Button>
          <Button variant="outline" size="sm">
            <Download />
            Export summary
          </Button>
          <Button size="sm" asChild>
            <Link href="/asset/registration">
              <Plus />
              Register asset
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
