"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, House } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SidebarDropdownMenu({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const normalizedPathname = pathname?.replace(/\/+$/, "") || "/"

  const normalizeUrl = (url: string) => {
    if (!url || url === "#") {
      return ""
    }

    return url.replace(/\/+$/, "")
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={normalizedPathname === "/dashboard"}
            className={cn(
              "data-[active=true]:bg-primary",
              "data-[active=true]:text-primary-foreground",
              "data-[active=true]:font-medium"
            )}
          >
            <Link href="/dashboard">
              <House />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map((item) => {
          const itemPath = normalizeUrl(item.url)
          const isItemActive =
            Boolean(itemPath) && normalizedPathname.startsWith(itemPath)
          const isNestedItemActive = item.items?.some((subItem) => {
            const subItemPath = normalizeUrl(subItem.url)
            return Boolean(subItemPath) && normalizedPathname === subItemPath
          })

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || isNestedItemActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isItemActive || isNestedItemActive}
                    className={cn(
                      "data-[active=true]:bg-primary",
                      "data-[active=true]:text-primary-foreground",
                      "data-[active=true]:font-medium"
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subItemPath = normalizeUrl(subItem.url)
                      const isSubItemActive =
                        Boolean(subItemPath) && normalizedPathname === subItemPath

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                            <Link href={subItem.url}>
                              <span className="text-sm">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
