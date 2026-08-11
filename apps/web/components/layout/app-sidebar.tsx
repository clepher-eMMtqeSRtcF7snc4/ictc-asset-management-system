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
import { CalendarCog, FileSliders, UserCog, Box } from "lucide-react"
import Image from "next/image"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      plan: "GAD Plan and Budget",
    },
  ],
  navMain: [
    {
      title: "Asset Management",
      url: "#",
      icon: (
        <Box
        />
      ),
      isActive: true,
      items: [
        {
          title: "Planning & Procurement",
          url: "#",
        },
        {
          title: "Asset Acquisition",
          url: "#",
        },
        {
          title: "Asset Registration",
          url: "/asset/registration",
        },
         {
          title: "Asset Assignment",
          url: "#",
        },
         {
          title: "Asset Utilization",
          url: "#",
        },
         {
          title: "Asset Transfer",
          url: "#",
        },
      ],
    },
    {
      title: "Management",
      url: "#",
      icon: (
        <FileSliders
        />
      ),
      items: [
        {
          title: "Inventory Audit",
          url: "#",
        },
        {
          title: "Depreciation",
          url: "#",
        },
        {
          title: "Asset Disposal",
          url: "#",
        },
      ],
    },
  ],
  administration: [
    {
      name: "GPB Matrix",
      url: "/master-data/matrix",
      icon: (
        <FileSliders
        />
      ),
    },
    {
      name: "Fiscal Year",
      url: "/master-data/fiscal-year",
      icon: (
        <CalendarCog />
      ),
    },
    {
      name: "User Management",
      url: "/master-data/user",
      icon: (
        <UserCog />
      ),
    },
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
      <SidebarFooter>
        {/* Footer Content */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
