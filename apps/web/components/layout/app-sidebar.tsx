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
  ShoppingCart,
  Truck,
  UsersRound,
} from "lucide-react"
import Image from "next/image"

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
        { title: "Asset Registration", url: "/asset/registration" },
        { title: "Asset Assignment", url: "/assets/assignments" },
        { title: "Asset Transfer & Returns", url: "/assets/transfers" },
        { title: "Maintenance & Warranty", url: "/maintenance" },
        { title: "Depreciation & Disposal", url: "/assets/disposal" },
      ],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: <Boxes />,
      items: [
        { title: "Inventory Items", url: "/inventory" },
        { title: "Stock In", url: "/inventory/stock-in" },
        { title: "Stock Out", url: "/inventory/stock-out" },
        { title: "Adjustments & Transfers", url: "/inventory/adjustments" },
        { title: "Physical Count", url: "/inventory/count" },
        { title: "Low Stock", url: "/inventory/low-stock" },
      ],
    },
    {
      title: "Procurement",
      url: "/procurement",
      icon: <ShoppingCart />,
      items: [
        { title: "Purchase Requests", url: "/procurement" },
        { title: "Purchase Orders", url: "/procurement/orders" },
        { title: "Suppliers", url: "/procurement/suppliers" },
      ],
    },
    {
      title: "Receiving",
      url: "/receiving",
      icon: <Truck />,
      items: [
        { title: "Deliveries", url: "/receiving" },
        { title: "Receiving & Inspection", url: "/receiving/inspection" },
      ],
    },
    {
      title: "Verification",
      url: "/verification",
      icon: <ClipboardCheck />,
      items: [
        { title: "Physical Inventory", url: "/verification" },
        { title: "Asset Verification", url: "/verification/assets" },
        { title: "Discrepancies", url: "/verification/discrepancies" },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: <FileBarChart2 />,
      items: [
        { title: "Asset Reports", url: "/reports/assets" },
        { title: "Inventory Reports", url: "/reports/inventory" },
        { title: "Maintenance Reports", url: "/reports/maintenance" },
        { title: "Procurement Reports", url: "/reports/procurement" },
      ],
    },
  ],
  administration: [
    { name: "Users & Roles", url: "/administration/users", icon: <UsersRound /> },
    { name: "Departments & Locations", url: "/administration/locations", icon: <Building2 /> },
    { name: "Categories", url: "/administration/categories", icon: <Settings2 /> },
    { name: "Audit Logs", url: "/administration/audit-logs", icon: <Archive /> },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarDropdownMenu items={data.navMain} />
        <SidebarSingleMenu settings={data.administration} />
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
