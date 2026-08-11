"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { ReactNode } from "react"

export function DepartmentsLocationsTabs({ defaultValue, departments, locations }: { defaultValue: "departments" | "locations"; departments: ReactNode; locations: ReactNode }) {
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold tracking-tight">Departments & Locations</h1><p className="mt-1 text-sm text-muted-foreground">Maintain the organizational units and physical locations used across ICT operations.</p></div><Tabs defaultValue={defaultValue}><TabsList variant="line"><TabsTrigger value="departments" asChild><Link href="/master-data/departments">Departments</Link></TabsTrigger><TabsTrigger value="locations" asChild><Link href="/master-data/locations">Locations</Link></TabsTrigger></TabsList><TabsContent value="departments" className="pt-4">{departments}</TabsContent><TabsContent value="locations" className="pt-4">{locations}</TabsContent></Tabs></div>
}
