"use client"

import * as React from "react"

import { SidebarDropdownMenu } from "@/components/layout/sidebar-dropdown-menu"
import { SidebarSingleMenu } from "@/components/layout/sidebar-single-menu"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Archive,
  Boxes,
  Building2,
  ClipboardCheck,
  FileBarChart2,
  Handshake,
  Package,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRound,
  UsersRound,
} from "lucide-react"
import Image from "next/image"
import { useAuthorization } from "@/hooks/use-authorization"

const data = {
  teams: [
    {
      name: "MSU at Naawan",
      logo: (
        <Image
          src="/img/msun-logo.png"
          alt="MSUN Logo"
          width={26}
          height={26}
        />
      ),
      plan: "ICT Asset Management",
    },
  ],
  navMain: [
    {
      title: "Asset Management",
      url: "/assets",
      icon: <Package />,
      items: [
        { title: "All Assets", url: "/assets" },
        { title: "Asset Registration", url: "/assets/registration" },
        { title: "Asset Assignment", url: "/assets/assignment" },
        { title: "Asset Transfer", url: "/assets/transfer" },
        { title: "Asset Returns", url: "/assets/return" },
        { title: "Maintenance & Warranty", url: "/maintenance" },
        { title: "Disposal", url: "/disposal" },
        { title: "Supplier", url: "/assets/supplier" },
        { title: "Settings", url: "/assets/settings" },
      ],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: <Boxes />,
      items: [
        { title: "Overview", url: "/inventory" },
        { title: "Items", url: "/inventory/items" },
        { title: "Receiving", url: "/inventory/receiving" },
        { title: "Issuance", url: "/inventory/issuance" },
        { title: "Stock Adjustments", url: "/inventory/adjustments" },
        { title: "Stock Count", url: "/inventory/stock-count" },
        { title: "Reorder", url: "/inventory/reorder" },
      ],
    },
    {
      title: "Procurement",
      url: "/procurement",
      icon: <ShoppingCart />,
      items: [
        { title: "Purchase Requests", url: "/procurement" },
        { title: "Purchase Orders", url: "/procurement" },
        { title: "Suppliers", url: "/administration/suppliers" },
      ],
    },
    {
      title: "Receiving",
      url: "/receiving",
      icon: <Truck />,
      items: [
        { title: "Deliveries", url: "/receiving" },
        { title: "Receiving & Inspection", url: "/receiving" },
      ],
    },
    {
      title: "Verification",
      url: "/physical-inventory",
      icon: <ClipboardCheck />,
      items: [
        { title: "Physical Inventory", url: "/physical-inventory" },
        { title: "Asset Verification", url: "/physical-inventory" },
        { title: "Discrepancies", url: "/physical-inventory" },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: <FileBarChart2 />,
      items: [
        { title: "Report Center", url: "/reports" },
      ],
    },
    {
      title: "Role & Permission",
      url: "/administration/roles-permissions",
      icon: <ShieldCheck />,
      items: [
        {
          title: "Users",
          url: "/administration/roles-permissions",
          requiredPermission: "users.read",
        },
        {
          title: "Roles",
          url: "/administration/roles-permissions",
          requiredPermission: "roles.read",
        },
        {
          title: "Permissions",
          url: "/administration/roles-permissions",
          requiredPermission: "permissions.read",
        },
      ],
    },
  ],
  administration: [
    { name: "Users", url: "/administration/roles-permissions", icon: <UsersRound /> },
    { name: "Locations", url: "/administration/locations", icon: <Building2 /> },
    { name: "Employees", url: "/administration/employees", icon: <UsersRound /> },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { can } = useAuthorization()

  const authorizedNavMain = React.useMemo(() => {
    return data.navMain
      .map((item) => {
        if (item.title === "Role & Permission") {
          const authorizedChildren = item.items?.filter(
            (child) => !child.requiredPermission || can(child.requiredPermission),
          )

          if (!authorizedChildren || authorizedChildren.length === 0) {
            return null
          }

          return {
            ...item,
            items: authorizedChildren.map(({ requiredPermission, ...child }) => child),
          }
        }

        return item
      })
      .filter(Boolean) as typeof data.navMain
  }, [can])

  const authorizedAdministration = React.useMemo(() => {
    return data.administration.filter((item) => {
      if (item.url === "/administration/roles-permissions") {
        return can("users.read") || can("roles.read") || can("permissions.read")
      }
      return true
    })
  }, [can])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {authorizedNavMain.length > 0 && (
          <SidebarDropdownMenu items={authorizedNavMain} />
        )}
        {authorizedAdministration.length > 0 && (
          <SidebarSingleMenu settings={authorizedAdministration} />
        )}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          <Handshake className="size-4 text-primary" />
          <span>ICT Asset Management</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
