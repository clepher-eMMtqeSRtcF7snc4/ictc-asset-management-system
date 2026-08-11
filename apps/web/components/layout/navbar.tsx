"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NavbarActions from "./navbar-actions";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { SearchIcon } from "lucide-react";


export function Navbar() {
  
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <InputGroup className="max-w-sm hidden lg:flex">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <NavbarActions />
    </header>
  );
}
