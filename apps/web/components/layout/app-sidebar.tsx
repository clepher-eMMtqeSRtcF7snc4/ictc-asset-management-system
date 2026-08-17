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
        { title: "Asset Registration", url: "/assets/registration" },
        { title: "Asset Assignment", url: "/assets/assignment" },
        { title: "Asset Transfer", url: "/assets/transfer" },
        { title: "Asset Returns", url: "/assets/return" },
        { title: "Maintenance & Warranty", url: "/maintenance" },
        { title: "Disposal", url: "/disposal" },
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
        { title: "Physical Count", url: "/physical-inventory" },
        { title: "Low Stock", url: "/inventory/low-stock" },
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
  ],
  administration: [
    { name: "Users", url: "/users", icon: <UsersRound /> },
    { name: "Master Data", url: "/master-data", icon: <Settings2 /> },
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
