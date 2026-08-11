"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import NavbarActions from "./navbar-actions"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { SearchIcon } from "lucide-react"
import { useState } from "react"

const searchResults = [
  { type: "Asset", name: "Dell Latitude 5450", detail: "AST-2026-000145 · Assigned to John Dela Cruz" },
  { type: "Inventory", name: "HDMI Cable, 2m", detail: "SKU-CBL-HDMI-002 · 46 units in stock" },
  { type: "Purchase Request", name: "PR-2026-0001", detail: "College of Engineering · Pending budget approval" },
]

export function Navbar() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const normalizedQuery = query.trim().toLowerCase()
  const results = normalizedQuery
    ? searchResults.filter((result) => `${result.type} ${result.name} ${result.detail}`.toLowerCase().includes(normalizedQuery))
    : []

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
        <div className="relative hidden w-96 lg:block">
          <InputGroup>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
              placeholder="Search assets, inventory, requests..."
              aria-label="Global search"
            />
            <InputGroupAddon><SearchIcon className="text-muted-foreground" /></InputGroupAddon>
          </InputGroup>
          {isOpen && normalizedQuery && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-md border bg-popover p-1 shadow-lg">
              {results.length > 0 ? results.map((result) => (
                <button key={result.name} className="w-full rounded-sm px-3 py-2 text-left hover:bg-muted">
                  <span className="text-xs font-medium text-primary">{result.type}</span>
                  <span className="block text-sm font-medium">{result.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{result.detail}</span>
                </button>
              )) : <p className="px-3 py-4 text-center text-sm text-muted-foreground">No matching records found.</p>}
            </div>
          )}
        </div>
      </div>
      <NavbarActions />
    </header>
  )
}
