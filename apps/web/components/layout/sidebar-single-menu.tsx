"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function SidebarSingleMenu({
  settings,
}: {
  settings: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  const pathname = usePathname()
  const normalizedPathname = pathname?.replace(/\/+$/, "") || "/"

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarMenu>
        {settings.map((item) => {
          const itemPath = item.url.replace(/\/+$/, "")
          const isActive = itemPath !== "" && normalizedPathname === itemPath

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive}
               className={cn(
                  "data-[active=true]:bg-primary",
                  "data-[active=true]:text-primary-foreground",
                  "data-[active=true]:font-medium"
                )}>
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
