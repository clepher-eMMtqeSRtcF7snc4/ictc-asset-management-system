import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CalendarDays, CheckCircle2, PercentIcon, PhilippinePeso } from "lucide-react";

interface FiscalYearHeaderSectionProps {
  summary: string[]
}

const summaryBox = [
    { label: 'Active Year', value: 'FY 2026', icon: CalendarDays, color: 'text-blue-600 bg-blue-50' },
    { label: 'Source of Budget', value: 'GAA', icon: CheckCircle2, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total GAA of the Agency', value: '₱524,031,000.00', icon: PhilippinePeso, color: 'text-amber-600 bg-amber-50' },
    { label: '5% of the total GAA', value: '₱26,201,550.00', icon: PercentIcon, color: 'text-green-600 bg-green-50' },
  ]

export default function FiscalYearHeaderSection({summary}: FiscalYearHeaderSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Fiscal Year</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
              title="Fiscal Year Management"
              description="Configure and manage fiscal year settings and parameters."
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summaryBox.map((s, i) => {
          const [tc, bg] = s.color.split(' ')
          const Icon = s.icon 
          return (
            <Card key={s.label}>
              <CardContent className="px-3 py-2 xl:p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${tc}`} />
                </div>
                <div>
                  <div className="md:text-lg xl:text-2xl font-bold text-accent-foreground">{summary[i]}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

